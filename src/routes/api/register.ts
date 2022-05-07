import { client, getUser } from "$lib/db";
import {badRequestWithMessage, forbidden, internalServerError, ok} from "$lib/responses";
import { validateCredentials } from "$lib/validation";
import * as argon2 from "../../lib/auth/argon2";
import {generateSessionCookie, getSessionFromRequest, isSessionValid} from "../../lib/auth/sessions";

export async function post({ request }) {
    try {
        if (await isSessionValid(getSessionFromRequest(request))) {
            return forbidden;
        }

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

        return {
            status: 302,
            headers: {
                "Set-Cookie": await generateSessionCookie(await getUser(data.email)),
                "Location": "/settings"
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}