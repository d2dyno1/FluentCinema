import { getUser } from '../../../lib/db';
import {
    badRequest,
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
import {object, string} from "yup";
import type {InferType} from "yup";
import {emailValidationRegex, passwordValidationRegex,} from "../../../lib/validation";

const loginSchema = object({
    email: string().required().matches(emailValidationRegex),
    password: string().required().matches(passwordValidationRegex)
});
interface LoginSchema extends InferType<typeof loginSchema> {}

export const post: RequestHandler = async ({ request }) => {
    if (await isSessionValid(getSessionFromRequest(request))) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.validate(params)) {
        return badRequest;
    }

    let user = await getUser(params.email);
    if (user == null) {
        return badRequestWithMessage("Account does not exist.");
    } else if (!await verify(user.hashed_password, params.password)) {
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
}