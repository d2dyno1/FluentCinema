import { client, getUser } from "$lib/db";
import {badRequestWithMessage, internalServerError, ok} from "$lib/responses";
import { validateCredentials } from "$lib/validation";
import * as argon2 from "$lib/argon2";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequestWithMessage("Missing credentials.");
        } else if (!validateCredentials(data.email, data.password)) {
            return badRequestWithMessage("Invalid credentials.");
        }

        const existingUser = await getUser(data.email);
        if (existingUser != undefined) {
            return badRequestWithMessage("This e-mail address is already in use.");
        }

        const hashedPassword = await argon2.hash(data.password);
        await client.query("INSERT INTO users(email, hashed_password) VALUES ($1, $2)", [data.email, hashedPassword]);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}