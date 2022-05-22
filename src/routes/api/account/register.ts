import { badRequest, badRequestWithMessage, forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { AccountDatabaseContext } from "$db/AccountDatabaseContext";
import { EmailVerificationDatabaseContext } from "$db/EmailVerificationDatabaseContext";
import { registerSchema } from "$data/schema/RegisterSchema";
import type { RegisterSchema } from "$data/schema/RegisterSchema";

export const post: RequestHandler = async ({ request }) => {
    if (await SessionDatabaseContext.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: RegisterSchema = await request.json();
    if (!await registerSchema.isValid(params)) {
        return badRequest;
    }

    if (await AccountDatabaseContext.getFromEmail(params.email) != undefined) {
        return badRequestWithMessage("This e-mail address is already in use.");
    } else if (await AccountDatabaseContext.isUsernameTaken(params.username)) {
        return badRequestWithMessage("This username is already taken.");
    }

    let user = await AccountDatabaseContext.create(params.username, params.email, params.password);
    await EmailVerificationDatabaseContext.beginVerification(user);

    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            "Set-Cookie": (await SessionDatabaseContext.create(user)).getCookie(),
        }
    };
}