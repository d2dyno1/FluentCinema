import { client, getUser } from "$lib/db";
import {badRequest, internalServerError, ok} from "$lib/responses";
import { validateCredentials } from "$lib/validation";
import * as argon2 from "$lib/argon2";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password") || !validateCredentials(data.email, data.password)) {
            return badRequest("");
        }

        const existingUser = await getUser(data.email);
        if (existingUser != undefined) {
            return badRequest("general.error.email.inUse");
        }

        const hashedPassword = await argon2.hash(data.password);
        await client.query("INSERT INTO users(email, hashed_password) VALUES ($1, $2)", [data.email, hashedPassword]);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}