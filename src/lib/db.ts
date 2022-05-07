import { Client } from 'pg';
import type { User } from "$data/User";
import db from "../../db.json"
import * as crypto from "crypto";

export const client = new Client(db);
client.connect().then(() => console.log("Connected to database."));

export async function getUser(email: string): Promise<User | undefined> {
    const result = await client.query("SELECT * FROM users WHERE email=$1;", [email]);
    return result.rowCount == 0 ? undefined : result.rows[0];
}

export async function getUserFromId(id: number): Promise<User | undefined> {
    const result = await client.query("SELECT * FROM users WHERE id=$1;", [id]);
    return result.rowCount == 0 ? undefined : result.rows[0];
}

export async function getUserFromSession(session: string): Promise<User | undefined> {
    const result = await client.query("SELECT user_id FROM sessions WHERE session=$1", [session]);
    return result.rowCount == 0 ? undefined : await getUserFromId(result.rows[0].user_id);
}

export async function createSessionId(user: User): Promise<string> {
    // TODO use a secure method for id generation
    const session = crypto.randomUUID();

    const existingUser = await getUserFromSession(session);
    if (existingUser != undefined) {
        return createSessionId(user);
    }

    await client.query("INSERT INTO sessions(user_id, session, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + (7 * interval '1 day'))", [user.id, session]);
    return session;
}

export async function invalidateSessionId(session: string): Promise<void> {
    await client.query("DELETE FROM sessions WHERE session=$1", [session]);
}