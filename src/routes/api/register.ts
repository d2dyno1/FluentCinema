import { client, getUser } from "$lib/db";
import { badRequest, badRequestWithMessage, forbidden, internalServerError, ok} from "$lib/responses";
import {usernameValidationRegex, validateCredentials} from "$lib/validation";
import * as argon2 from "../../lib/auth/argon2";
import {generateSessionCookie, getSessionFromRequest, isSessionValid} from "../../lib/auth/sessions";

export async function post({ request }) {
    try {
        if (await isSessionValid(getSessionFromRequest(request))) {
            return forbidden;
        }

        const data = await request.json();
        if (!data.hasOwnProperty("username") || !data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest;
        } else if (!usernameValidationRegex.test(data.username) || !validateCredentials(data.email, data.password)) {
            return badRequest;
        }

        const existingUser = await getUser(data.email);
        if (existingUser != undefined) {
            return badRequestWithMessage("This e-mail address is already in use.");
        }

        const hashedPassword = await argon2.hash(data.password);
        await client.query("INSERT INTO users(email, hashed_password, username) VALUES ($1, $2, $3)", [data.email, hashedPassword, data.username]);

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