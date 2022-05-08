import crypto from "crypto";
import {client, getUserBySession} from "../db";
import type { User } from "../../data/db/User";
import type { Session } from "../../data/db/Session";
import {parse, serialize} from "cookie";
import moment from "moment";
import { promisify } from "util";

const randomBytesAsync = promisify(crypto.randomBytes);

export async function generateSession(user: User): Promise<Session> {
    let bytes = await randomBytesAsync(64);
    let session = bytes.toString("base64");

    const existingUser = await getUserBySession(session);
    if (existingUser != undefined) {
        return generateSession(user);
    }

    let createdAt = moment().toDate();
    let expiresAt = moment().add(7, "days").toDate();
    await client.query("INSERT INTO sessions(user_id, session, created_at, expires_at) VALUES ($1, $2, $3, $4)", [user.id, session, createdAt, expiresAt]);
    return {
        user_id: user.id,
        session: session,
        created_at: createdAt,
        expires_at: expiresAt
    }
}

export async function invalidateSession(session: string) {
    await client.query("DELETE FROM sessions WHERE session=$1;", [session]);
}

export async function isSessionValid(session: string): Promise<boolean> {
    let query = await client.query("SELECT * FROM sessions WHERE session=$1;", [session]);
    if (query.rowCount == 0) {
        return false;
    }

    let result: Session = query.rows[0];
    if (new Date() > result.expires_at) {
        await invalidateSession(session);
        return false;
    }

    return true;
}

export async function generateSessionCookie(user: User): Promise<string> {
    let session = await generateSession(user);
    return serialize("session", session.session, {
        expires: session.expires_at,
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "strict"
    });
}

export function getSessionFromRequest(request: Request) {
    return parse(request.headers.get("cookie") || "").session;
}

export function generateEmptySessionCookie(): string {
    return serialize("session", "", {
        maxAge: 0,
        expires: new Date(),
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "strict"
    })
}