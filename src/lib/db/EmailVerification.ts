import crypto from "crypto";
import { promisify } from "util";
import {client} from "../db";
import moment from "moment";
import type {User} from "./User";
import {Expirable, initializeExpiredEntryDeleter} from "./Expirable";

const randomBytesAsync = promisify(crypto.randomBytes);

const baseVerificationUrl = "https://fluentcinema.zsti.eu/verify?token=";
const tokenTimespan = 15; // in minutes

export class EmailVerification extends Expirable {
    private readonly user_id!: string;
    private readonly token!: string;

    public static async tryVerifyEmail(user: User, token: string): Promise<boolean> {
        let verification = await EmailVerification.getFromToken(token);
        if (verification == null || verification.user_id != user.id || verification.isExpired()) {
            return false;
        }
        await client.query("UPDATE users SET is_verified=true WHERE id=$1;", [user.id]); // verify
        await verification.invalidate();
        return true;
    }

    public async invalidate() {
        await client.query("DELETE FROM email_verification_tokens WHERE token=$1;", [this.token]);
    }

    public static async getFromToken(token: string): Promise<EmailVerification | null> {
        let query = await client.query("SELECT * FROM email_verification_tokens WHERE token=$1;", [token]);
        return query.rowCount == 0 ? null : Object.assign(new EmailVerification(), query.rows[0]);
    }

    public static async beginVerification(user: User) {
        await user.sendMail("test", await EmailVerification.generateVerificationLink(user));
    }

    public static async generateVerificationLink(user: User) {
        let bytes = await randomBytesAsync(128);
        let token = bytes.toString("base64");
        let expiresAt = moment().add(tokenTimespan, "minutes").toDate();
        await client.query("INSERT INTO email_verification_tokens(user_id, token, expires_at) VALUES ($1, $2, $3);", [user.id, token, expiresAt]);
        return baseVerificationUrl + encodeURIComponent(token);
    }
}

initializeExpiredEntryDeleter(() => new EmailVerification(), "email_verification_tokens");