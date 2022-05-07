// @ts-ignore
import { Client, QueryResult } from 'pg';
import type { User } from "$data/User";
import db from "../../db.json"

export const client = new Client(db);
client.connect().then(() => console.log("Connected to database."));

export async function getUser(email: string): Promise<User | undefined> {
    const result = await client.query("SELECT * FROM users WHERE email=$1;", [email]);
    return result.rowCount == 0 ? undefined : result.rows[0];
}