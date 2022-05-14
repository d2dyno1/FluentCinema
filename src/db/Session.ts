import crypto from "crypto";
import {parse, serialize} from "cookie";
import moment from "moment";
import {promisify} from "util";
import {client} from ".";
import {User} from "./User";
import {Expirable, initializeExpiredEntryDeleter} from "./Expirable";

const randomBytesAsync = promisify(crypto.randomBytes);

const sessionTimespan = 7; // in days

export class Session extends Expirable {
    private readonly session!: string; // TODO rename to token

    public async invalidate() {
        await client.query("DELETE FROM sessions WHERE session=$1;", [this.session]);
    }

    public getCookie() {
        return serialize("session", this.session, {
            expires: this.expires_at,
            path: "/",
            // secure: true,
            // httpOnly: true,
            sameSite: "strict"
        });
    }

    public static generateEmptyCookie() {
        return serialize("session", "", {
            maxAge: 0,
            expires: new Date(),
            path: "/",
            // secure: true,
            // httpOnly: true,
            sameSite: "strict"
        })
    }

    public async getUser(): Promise<User> {
        return await User.getFromSession(this.session) as User;
    }

    public static async getFromRequest(request: Request) {
        return await Session.getFromToken(parse(request.headers.get("cookie") || "").session);
    }

    public static async getFromToken(token: string): Promise<Session | null> {
        let query = await client.query("SELECT * FROM sessions WHERE session=$1", [token]);
        if (query.rowCount == 0) {
            return null;
        }
        let session: Session = Object.assign(new Session(), query.rows[0]);
        if (session.isExpired()) {
            await session.invalidate();
            return null;
        }
        return session;
    }

    public static async create(user: User): Promise<Session> {
        let bytes = await randomBytesAsync(64);
        let token = bytes.toString("base64");

        const existingUser = await User.getFromSession(token);
        if (existingUser != null) {
            return Session.create(user);
        }

        let createdAt = moment().toDate();
        let expiresAt = moment().add(sessionTimespan, "days").toDate();
        await client.query("INSERT INTO sessions(user_id, session, created_at, expires_at) VALUES ($1, $2, $3, $4)", [user.id, token, createdAt, expiresAt]);
        return Object.assign(new Session(), await Session.getFromToken(token));
    }
}

initializeExpiredEntryDeleter(() => new Session(), "sessions");