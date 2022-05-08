import {client, getUser, isUsernameTaken} from "../../../lib/db";
import {badRequest, badRequestWithMessage, forbidden, internalServerError, missingParameters, ok} from "../../../lib/responses";
import {usernameValidationRegex, validateCredentials} from "../../../lib/validation";
import * as argon2 from "../../../lib/auth/argon2";
import {generateSessionCookie, getSessionFromRequest, isSessionValid} from "../../../lib/auth/sessions";
import {sendMail} from "../../../lib/mail";
import {generateVerificationLink} from "../../../lib/auth/emailverification";
import type {RequestHandler} from "@sveltejs/kit";
import type {RegisterParams} from "../../../data/params/RegisterParams"

export const post: RequestHandler = async ({ request }) => {
    try {
        if (await isSessionValid(getSessionFromRequest(request))) {
            return forbidden;
        }

        let params: RegisterParams = await request.json();
        if (params.username == null || params.email == null || params.password == null) {
            return missingParameters;
        } else if (!usernameValidationRegex.test(params.username) || !validateCredentials(params.email, params.password)) {
            return badRequest;
        }

        if (await getUser(params.email) != undefined) {
            return badRequestWithMessage("This e-mail address is already in use.");
        } else if (await isUsernameTaken(params.username)) {
            return badRequestWithMessage("This username is already taken.");
        }

        const hashedPassword = await argon2.hash(params.password);
        await client.query("INSERT INTO users(email, hashed_password, username) VALUES ($1, $2, $3)", [params.email, hashedPassword, params.username]);
        let user = await getUser(params.email);

        await sendMail(user, "test", await generateVerificationLink(user));

        return {
            status: 200,
            body: {
                success: true
            },
            headers: {
                "Set-Cookie": await generateSessionCookie(await getUser(params.email)),
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}