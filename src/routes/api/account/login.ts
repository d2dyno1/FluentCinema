import {badRequest, badRequestWithMessage, forbidden, forbiddenWithMessage} from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import {User} from "$db/User";
import {Session} from "$db/Session";
import {loginSchema} from "$data/schema/LoginSchema";
import type {LoginSchema} from "$data/schema/LoginSchema";

export const post: RequestHandler = async ({ request }) => {
    if (await Session.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.isValid(params)) {
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