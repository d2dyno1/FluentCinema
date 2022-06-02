import { badRequest, badRequestWithMessage, forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import { AccountController } from "$db/AccountController";
import { EmailVerificationController } from "$db/EmailVerificationController";
import { registerSchema } from "$data/schema/RegisterSchema";
import type { RegisterSchema } from "$data/schema/RegisterSchema";

export const post: RequestHandler = async ({ request }) => {
    if (await SessionController.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: RegisterSchema = await request.json();
    if (!await registerSchema.isValid(params)) {
        return badRequest;
    }

    if (await AccountController.getFromEmail(params.email) != undefined) {
        return badRequestWithMessage("This e-mail address is already in use.");
    } else if (await AccountController.isUsernameTaken(params.username)) {
        return badRequestWithMessage("This username is already taken.");
    }

    let user = await AccountController.create(params.username, params.email, params.password);
    await EmailVerificationController.beginVerification(user);

    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            "Set-Cookie": (await SessionController.create(user)).getCookie(),
        }
    };
}