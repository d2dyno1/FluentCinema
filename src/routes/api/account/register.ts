import {badRequest, badRequestWithMessage, forbidden} from "../../../lib/responses";
import {
    emailValidationRegex,
    passwordValidationRegex,
    usernameValidationRegex,
} from "../../../lib/validation";
import type {RequestHandler} from "@sveltejs/kit";
import { object, string } from "yup";
import type { InferType} from "yup";
import {Session} from "../../../lib/db/Session";
import {User} from "../../../lib/db/User";
import {EmailVerification} from "../../../lib/db/EmailVerification";

const registerSchema = object({
    username: string().required().matches(usernameValidationRegex),
    email: string().required().matches(emailValidationRegex),
    password: string().required().matches(passwordValidationRegex)
});
interface RegisterSchema extends InferType<typeof registerSchema> {}

export const post: RequestHandler = async ({ request }) => {
    if (await Session.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: RegisterSchema = await request.json();
    if (!await registerSchema.isValid(params)) {
        return badRequest;
    }

    if (await User.getFromEmail(params.email) != undefined) {
        return badRequestWithMessage("This e-mail address is already in use.");
    } else if (await User.isUsernameTaken(params.username)) {
        return badRequestWithMessage("This username is already taken.");
    }

    let user = await User.create(params.username, params.email, params.password);
    await EmailVerification.beginVerification(user);

    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            "Set-Cookie": (await Session.create(user)).getCookie(),
        }
    };
}