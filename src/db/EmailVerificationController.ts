import crypto from "crypto";
import { promisify } from "util";
import {client} from ".";
import moment from "moment";
import type { AccountController } from "$db/AccountController";
import type { IExpirable } from "$db/IExpirable";

const randomBytesAsync = promisify(crypto.randomBytes);

const baseVerificationUrl = "https://fluentcinema.zsti.eu/verify?token=";
const tokenTimespan = 15; // in minutes

export class EmailVerificationController implements IExpirable {
    private readonly user_id!: string;
    private readonly token!: string;
    private readonly expires_at!: string;

    private constructor(emailVerification: Partial<EmailVerificationController>) {
        Object.assign(this, emailVerification);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expires_at);
    }

    async invalidate() {
        await client.query("DELETE FROM email_verification_tokens WHERE token=$1;", [this.token]);
    }

    static async tryVerifyEmail(user: AccountController, token: string): Promise<boolean> {
        let verification = await EmailVerificationController.getFromToken(token);
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

    static async getFromToken(token: string): Promise<EmailVerificationController | null> {
        let query = await client.query("SELECT * FROM email_verification_tokens WHERE token=$1;", [token]);
        return query.rowCount == 0 ? null : new EmailVerificationController(query.rows[0]);
    }

    static async beginVerification(user: AccountController) {
        let link = await EmailVerificationController.generateVerificationLink(user);
        await user.sendMail("E-mail verification", `In order to verify your e-mail address, please click on the link below.\n${link}`);
    }

    private static async generateVerificationLink(user: AccountController) {
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
    await EmailVerificationController.deleteExpiredEntries();
}, 600000);