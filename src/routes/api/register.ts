import { client, getUser } from "$lib/database/db";
import {badRequest, internalServerError} from "../../lib/api";
import { validateCredentials } from "$lib/auth";
import * as argon2 from "$lib/argon2";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest("Missing credentials.");
        } else if (!validateCredentials(data.email, data.password)) {
            return badRequest("Invalid credentials.");
        }

        let existingUser = await getUser(data.email);
        if (existingUser != undefined) {
            return badRequest("This e-mail address is already in use.");
        }

        let hashedPassword = await argon2.hash(data.password);
        await client.query("INSERT INTO users(email, hashed_password) VALUES ($1, $2)", [data.email, hashedPassword]);

        return {
            status: 200,
            body: {
                success: true
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}