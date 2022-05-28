import {client} from "$db";
import sharp from "sharp";
import * as crypto from "crypto";
import * as argon2 from "argon2";
import credentials from "../../credentials.json";
import nodemailer from "nodemailer";
import NodeCache from "node-cache";
import { ReservationDatabaseContext } from "./ReservationDatabaseContext";
import { SettingsDatabaseContext } from "$db/SettingsDatabaseContext";
import { EmailVerificationDatabaseContext } from "$db/EmailVerificationDatabaseContext";

const pictureCache = new NodeCache({ stdTTL: 0 });

const mailTransporter = nodemailer.createTransport(credentials.mail);

const argon2Options = {
    type: argon2.argon2id
};

const targetPictureSize = 64; // Size of the picture stored in the database

export class AccountDatabaseContext {
    readonly id!: string;
    readonly email!: string;
    private readonly hashed_password!: string;
    readonly username!: string;
    readonly is_verified!: boolean;

    readonly picture: Uint8Array | null;

    private constructor(account: Partial<AccountDatabaseContext>, picture: Uint8Array | null) {
        Object.assign(this, account);
        this.picture = picture;
    }

    protected static async construct(account: Partial<AccountDatabaseContext>): Promise<AccountDatabaseContext> {
        let picture: Uint8Array | null;
        if (pictureCache.has(account.id!)) {
            picture = pictureCache.get(account.id!) as Uint8Array;
        } else {
            picture = (await client.query("SELECT picture FROM users WHERE id=$1;", [account.id!])).rows[0].picture;
            if (picture != null) {
                pictureCache.set(account.id!, picture);
            }
        }
        return new AccountDatabaseContext(account, picture);
    }

    async getReservations() {
        return await ReservationDatabaseContext.getFromUser(this);
    }

    async changePicture(imageBuffer: Uint8Array | null) {
        if (imageBuffer != null) {
            imageBuffer = await sharp(imageBuffer)
                .resize(targetPictureSize)
                .png()
                .toBuffer();
        }
        await client.query("UPDATE users SET picture=$1 WHERE id=$2;", [imageBuffer, this.id]);
        pictureCache.set(this.id, imageBuffer);
    }

    async delete(): Promise<void> {
        await client.query("DELETE FROM sessions WHERE user_id=$1;", [this.id]);
        client.query("DELETE FROM users WHERE id=$1;", [this.id]);
        client.query("DELETE FROM email_verification_tokens WHERE user_id=$1;", [this.id]);
        client.query("DELETE FROM settings WHERE user_id=$1;", [this.id]);
    }

    async getSettings(): Promise<SettingsDatabaseContext> {
        return SettingsDatabaseContext.getFromUser(this);
    }

    async verifyPassword(password: string): Promise<boolean> {
        return argon2.verify(this.hashed_password, password, argon2Options);
    }

    async changeEmail(email: string): Promise<void> {
        await client.query("UPDATE users SET email=$1, is_verified=false WHERE id=$2", [email, this.id]);
        await client.query(`UPDATE settings SET "twoFactorAuthentication"=false WHERE user_id=$1`, [this.id]);
        await EmailVerificationDatabaseContext.beginVerification(await AccountDatabaseContext.getFromId(this.id) as AccountDatabaseContext);
    }

    async sendMail(subject: string, content: string): Promise<void> {
        await mailTransporter.sendMail({
            from: "FluentCinema <fluentcinema+noreply@zsti.eu>",
            to: `${this.username} <${this.email}>`,
            subject: subject,
            text: content
        });
    }

    static async create(username: string, email: string, password: string): Promise<AccountDatabaseContext> {
        let id = crypto.randomUUID();
        if (await this.isIdTaken(id)) {
            return await AccountDatabaseContext.create(username, email, password);
        }
        let hashedPassword = await argon2.hash(password);
        await client.query("INSERT INTO users(id, email, hashed_password, username) VALUES ($1, $2, $3, $4)", [id, email, hashedPassword, username]);
        let user = await this.getFromEmail(email) as AccountDatabaseContext;
        await SettingsDatabaseContext.create(user);
        return user;
    }

    static async isIdTaken(id: string) {
        let query = await client.query("SELECT * FROM users WHERE id=$1;", [id]);
        return query.rowCount != 0;
    }

    private static async getFromColumn(columnName: string, value: string): Promise<AccountDatabaseContext | null> {
        let query = await client.query(`SELECT id, email, hashed_password, username, is_verified FROM users WHERE ${columnName}=$1;`, [value]);
        return query.rowCount == 0 ? null : this.construct(query.rows[0]);
    }

    static async getFromId(id: string): Promise<AccountDatabaseContext | null> {
        return AccountDatabaseContext.getFromColumn("id", id);
    }

    static async getFromEmail(email: string): Promise<AccountDatabaseContext | null> {
        return AccountDatabaseContext.getFromColumn("email", email);
    }

    static async getFromSession(sessionToken: string): Promise<AccountDatabaseContext | null> {
        let query = await client.query("SELECT id, email, hashed_password, username, is_verified FROM sessions JOIN users on user_id = users.id WHERE session=$1", [sessionToken]);
        return query.rowCount == 0 ? null : this.construct(query.rows[0]);
    }

    static async isUsernameTaken(username: string): Promise<boolean> {
        return await AccountDatabaseContext.getFromColumn("username", username) != null;
    }
}