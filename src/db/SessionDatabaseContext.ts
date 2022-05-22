import crypto from "crypto";
import {parse, serialize} from "cookie";
import moment from "moment";
import {promisify} from "util";
import {client} from ".";
import {AccountDatabaseContext} from "./AccountDatabaseContext";
import type { IExpirable } from "$db/IExpirable";

const randomBytesAsync = promisify(crypto.randomBytes);

const sessionTimespan = 7; // in days

export class SessionDatabaseContext implements IExpirable {
    private readonly session!: string; // TODO rename to token
    private readonly expires_at!: Date;

    async invalidate() {
        await client.query("DELETE FROM sessions WHERE session=$1;", [this.session]);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expires_at);
    }

    getCookie(): string {
        return serialize("session", this.session, {
            expires: this.expires_at,
            path: "/",
            // secure: true,
            // httpOnly: true,
            sameSite: "strict"
        });
    }

    static generateEmptyCookie(): string {
        return serialize("session", "", {
            maxAge: 0,
            expires: new Date(),
            path: "/",
            // secure: true,
            // httpOnly: true,
            sameSite: "strict"
        })
    }

    public async getUser(): Promise<AccountDatabaseContext> {
        return await AccountDatabaseContext.getFromSession(this.session) as AccountDatabaseContext;
    }

    public static async getFromRequest(request: Request) {
        return await SessionDatabaseContext.getFromToken(parse(request.headers.get("cookie") || "").session);
    }

    public static async getFromToken(token: string): Promise<SessionDatabaseContext | null> {
        let query = await client.query("SELECT * FROM sessions WHERE session=$1", [token]);
        if (query.rowCount == 0) {
            return null;
        }
        let session: SessionDatabaseContext = Object.assign(new SessionDatabaseContext(), query.rows[0]);
        if (session.isExpired()) {
            await session.invalidate();
            return null;
        }
        return session;
    }

    public static async create(user: AccountDatabaseContext): Promise<SessionDatabaseContext> {
        let bytes = await randomBytesAsync(64);
        let token = bytes.toString("base64");

        const existingUser = await AccountDatabaseContext.getFromSession(token);
        if (existingUser != null) {
            return SessionDatabaseContext.create(user);
        }

        let createdAt = moment().toDate();
        let expiresAt = moment().add(sessionTimespan, "days").toDate();
        await client.query("INSERT INTO sessions(user_id, session, created_at, expires_at) VALUES ($1, $2, $3, $4)", [user.id, token, createdAt, expiresAt]);
        return Object.assign(new SessionDatabaseContext(), await SessionDatabaseContext.getFromToken(token));
    }

    static async deleteExpiredEntries(): Promise<void> {
        await client.query("DELETE FROM sessions WHERE expires_at > $1;", [new Date()]);
    }
}

setInterval(async () => {
    await SessionDatabaseContext.deleteExpiredEntries();
}, 600000);