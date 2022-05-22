import crypto from "crypto";
import { promisify } from "util";
import {client} from ".";
import moment from "moment";
import type {AccountDatabaseContext} from "$db/AccountDatabaseContext";
import type { IExpirable } from "$db/IExpirable";

const randomBytesAsync = promisify(crypto.randomBytes);

const baseVerificationUrl = "https://fluentcinema.zsti.eu/verify?token=";
const tokenTimespan = 15; // in minutes

export class EmailVerificationDatabaseContext implements IExpirable {
    private readonly user_id!: string;
    private readonly token!: string;
    private readonly expires_at!: string;

    private constructor(emailVerification: Partial<EmailVerificationDatabaseContext>) {
        Object.assign(this, emailVerification);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expires_at);
    }

    async invalidate() {
        await client.query("DELETE FROM email_verification_tokens WHERE token=$1;", [this.token]);
    }

    static async tryVerifyEmail(user: AccountDatabaseContext, token: string): Promise<boolean> {
        let verification = await EmailVerificationDatabaseContext.getFromToken(token);
        if (verification == null || verification.user_id != user.id || verification.isExpired()) {
            return false;
        }
        if (verification.isExpired()) {
            await verification.invalidate();
            return false;
        }
        await client.query("UPDATE users SET is_verified=true WHERE id=$1;", [user.id]);
        await verification.invalidate();
        return true;
    }

    static async getFromToken(token: string): Promise<EmailVerificationDatabaseContext | null> {
        let query = await client.query("SELECT * FROM email_verification_tokens WHERE token=$1;", [token]);
        return query.rowCount == 0 ? null : new EmailVerificationDatabaseContext(query.rows[0]);
    }

    static async beginVerification(user: AccountDatabaseContext) {
        await user.sendMail("test", await EmailVerificationDatabaseContext.generateVerificationLink(user));
    }

    private static async generateVerificationLink(user: AccountDatabaseContext) {
        let bytes = await randomBytesAsync(128);
        let token = bytes.toString("base64");
        let expiresAt = moment().add(tokenTimespan, "minutes").toDate();
        await client.query("INSERT INTO email_verification_tokens(user_id, token, expires_at) VALUES ($1, $2, $3);", [user.id, token, expiresAt]);
        return baseVerificationUrl + encodeURIComponent(token);
    }

    static async deleteExpiredEntries(): Promise<void> {
        await client.query("DELETE FROM email_verification_tokens WHERE $1 > expires_at;", [new Date()]);
    }
}

setInterval(async () => {
    await EmailVerificationDatabaseContext.deleteExpiredEntries();
}, 600000);