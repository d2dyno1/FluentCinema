// @ts-ignore
import { Client, QueryResult } from "pg";
import { User } from "./User";

export const client = new Client();

client.connect().then(() => console.log("Connected to database."));

export async function getUser(email: string): Promise<User | undefined> {
    let result = await client.query("SELECT * FROM users WHERE email=$1;", [email]);
    if (result.rowCount == 0) {
        return undefined;
    } else {
        let row = result.rows[0];
        return new User(row.id, row.email, row.hashed_password);
    }
}