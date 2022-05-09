import {badRequest, badRequestWithMessage, forbidden, forbiddenWithMessage} from "../../../lib/responses";
import type { RequestHandler } from "@sveltejs/kit";
import {object, string} from "yup";
import type {InferType} from "yup";
import {emailValidationRegex, passwordValidationRegex} from "../../../lib/validation";
import {User} from "../../../lib/db/User";
import {Session} from "../../../lib/db/Session";

const loginSchema = object({
    email: string().required().matches(emailValidationRegex),
    password: string().required().matches(passwordValidationRegex)
});
interface LoginSchema extends InferType<typeof loginSchema> {}

export const post: RequestHandler = async ({ request }) => {
    if (await Session.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.validate(params)) {
        return badRequest;
    }

    let user = await User.getFromEmail(params.email);
    if (user == null) {
        return badRequestWithMessage("Account does not exist.");
    } else if (!await user.verifyPassword(params.password)) {
        return forbiddenWithMessage("Incorrect password.");
    }

    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            'Set-Cookie': (await Session.create(user)).getCookie()
        }
    };
}