import {client} from "../db";
import sharp from "sharp";
import * as crypto from "crypto";
import * as argon2 from "argon2";
import credentials from "../../../credentials.json";
import nodemailer from "nodemailer";

const mailTransporter = nodemailer.createTransport(credentials.mail);

const argon2Options = {
    type: argon2.argon2id
};

const targetPictureSize = 32; // Size of the picture stored in the database

export class User {
    public readonly id!: string;
    public readonly email!: string;
    private readonly hashed_password!: string;
    public readonly username!: string;
    public readonly picture!: Uint8Array | null;

    public async changePicture(imageBuffer: Uint8Array | null) {
        if (imageBuffer != null) {
            imageBuffer = await sharp(imageBuffer)
                .resize(targetPictureSize)
                .png()
                .toBuffer();
        }
        await client.query("UPDATE users SET picture=$1 WHERE id=$2;", [imageBuffer, this.id]);
    }

    public async delete() {
        await client.query("DELETE FROM users WHERE id=$1", [this.id]);
        await client.query("DELETE FROM sessions WHERE user_id=$1", [this.id]);
        await client.query("DELETE FROM email_verification_tokens WHERE user_id=$1", [this.id]);
    }

    public async verifyPassword(password: string) {
        return await argon2.verify(this.hashed_password, password, argon2Options);
    }

    public async sendMail(subject: string, content: string) {
        await mailTransporter.sendMail({
            from: "FluentCinema <fluentcinema+noreply@zsti.eu>",
            to: `${this.username} <${this.email}>`,
            subject: subject,
            text: content
        });
    }

    public static async create(username: string, email: string, password: string): Promise<User> {
        let id = crypto.randomUUID();
        if (await this.isIdTaken(id)) {
            return await User.create(username, email, password);
        }
        let hashedPassword = await argon2.hash(password);
        await client.query("INSERT INTO users(id, email, hashed_password, username) VALUES ($1, $2, $3, $4)", [id, email, hashedPassword, username]);
        return await this.getFromEmail(email) as User;
    }

    public static async isIdTaken(id: string) {
        let query = await client.query("SELECT * FROM users WHERE id=$1;", [id]);
        return query.rowCount != 0;
    }

    public static async getFromEmail(email: string): Promise<User | null> {
        let query = await client.query("SELECT * FROM users WHERE email=$1;", [email]);
        return query.rowCount == 0 ? null : Object.assign(new User(), query.rows[0]);
    }

    public static async getFromSession(sessionToken: string): Promise<User | null> {
        let query = await client.query("SELECT id, email, hashed_password, username, picture FROM sessions JOIN users on user_id = users.id WHERE session=$1", [sessionToken]);
        return query.rowCount == 0 ? null : Object.assign(new User(), query.rows[0]);
    }

    public static async isUsernameTaken(username: string): Promise<boolean> {
        let query = await client.query("SELECT * FROM users WHERE username=$1", [username]);
        return query.rowCount != 0;
    }
}