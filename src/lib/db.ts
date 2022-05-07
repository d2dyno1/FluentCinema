import { Client } from 'pg';
import type { User } from "$data/User";
import db from "../../db.json"

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