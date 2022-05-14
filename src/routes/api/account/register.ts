import {badRequest, badRequestWithMessage, forbidden} from "$api/responses";
import type {RequestHandler} from "@sveltejs/kit";
import {Session} from "$db/Session";
import {User} from "$db/User";
import {EmailVerification} from "$db/EmailVerification";
import {registerSchema} from "$data/schema/RegisterSchema";
import type {RegisterSchema} from "$data/schema/RegisterSchema";

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