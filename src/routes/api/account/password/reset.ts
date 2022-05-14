import {badRequest, badRequestWithMessage, internalServerError, ok} from "$api/responses";
import type {RequestHandler} from "@sveltejs/kit";
import {User} from "$db/User";
import type {ResetPasswordSchema} from "$data/schema/ResetPasswordSchema";
import {resetPasswordSchema} from "$data/schema/ResetPasswordSchema";

export const post: RequestHandler = async ({ request }) => {
    try {
        let params: ResetPasswordSchema = await request.json();
        if (!await resetPasswordSchema.isValid(params)) {
            return badRequest;
        }

        let existingUser = await User.getFromEmail(params.email);
        if (existingUser == null) {
            return badRequestWithMessage("This e-mail address is not associated with any account.");
        }

        // TODO

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}