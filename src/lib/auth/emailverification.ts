import crypto from "crypto";
import { promisify } from "util";
import type { User } from "../../data/User";
import {client} from "../db";
import moment from "moment";
import type { EmailVerificationToken } from "../../data/db/EmailVerificationToken";

const randomBytesAsync = promisify(crypto.randomBytes);

const baseVerificationUrl = "http://localhost:3000/verify?token=";

async function generateToken() {
    let bytes = await randomBytesAsync(128);
    return bytes.toString("base64");
}

export async function generateVerificationLink(user: User) {
    let token = await generateToken();
    let expiresAt = moment().add(15, "minutes").toDate();
    await client.query("INSERT INTO email_verification_tokens(user_id, token, expires_at) VALUES ($1, $2, $3);", [user.id, token, expiresAt]);
    return baseVerificationUrl + encodeURIComponent(token);
}

// TODO automatic token cleanup on expiry
export async function isTokenValid(token: string) {
    let query = await client.query("SELECT * from email_verification_tokens WHERE token=$1;", [token]);
    if (query.rowCount == 0) {
        return false;
    }

    let emailVerificationToken: EmailVerificationToken = query.rows[0];
    console.log(emailVerificationToken.expires_at);
    if (moment().isAfter(moment(emailVerificationToken.expires_at))) {
        await invalidateToken(emailVerificationToken.token);
        return false;
    }
    return true;
}

export async function invalidateToken(token: string) {
    await client.query("DELETE FROM email_verification_tokens WHERE token=$1;", [token]);
}

export async function verifyEmail(token: string) {
    let queryResult = await client.query("SELECT user_id FROM email_verification_tokens WHERE token=$1", [token]);
    let userId = queryResult.rows[0].user_id;
    await client.query("DELETE FROM email_verification_tokens WHERE user_id=$1;", [userId]);
    await client.query("UPDATE users SET is_verified=true WHERE id=$1;", [userId]);
}