import { getUser } from '../../../lib/db';
import {
    badRequestWithMessage,
    forbidden,
    forbiddenWithMessage,
    internalServerError,
    missingParameters
} from "../../../lib/responses";
import { verify } from "../../../lib/auth/argon2";
var exports = {}; // dirty hack to make cookie work
import {parse, serialize} from "cookie";
import {generateSessionCookie, getSessionFromRequest, isSessionValid} from "../../../lib/auth/sessions";
import type { RequestHandler } from "@sveltejs/kit";
import type { LoginParams } from "../../../data/params/LoginParams";

export const post: RequestHandler = async ({ request }) => {
    try {
        if (await isSessionValid(getSessionFromRequest(request))) {
            return forbidden;
        }

        let params: LoginParams = await request.json();
        if (params.email == null || params.password == null) {
            return missingParameters;
        }

        let user = await getUser(params.email);
        if (user == null) {
            return badRequestWithMessage("Account does not exist.");
        }

        if (!await verify(user.hashed_password, params.password)) {
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