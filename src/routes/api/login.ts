import { getUser } from '$lib/db';
import {badRequestWithMessage, forbidden, forbiddenWithMessage, internalServerError, ok} from "$lib/responses";
import { verify } from "../../lib/auth/argon2";
var exports = {}; // dirty hack to make cookie work
import {parse, serialize} from "cookie";
import {generateSessionCookie, getSessionFromRequest, isSessionValid} from "../../lib/auth/sessions";

export async function post({ request }) {
    try {
        if (await isSessionValid(getSessionFromRequest(request))) {
            return forbidden;
        }

        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequestWithMessage("Missing credentials.");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequestWithMessage("Account does not exist.");
        }

        if (!await verify(user.hashed_password, data.password)) {
            return forbiddenWithMessage("Incorrect password.");
        }

        return {
            status: 200,
            body: {
                success: true
            },
            headers: {
                'Set-Cookie': await generateSessionCookie(user)
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}