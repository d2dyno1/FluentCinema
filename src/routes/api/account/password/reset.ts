import { badRequest, badRequestWithMessage, internalServerError, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { AccountDatabaseContext } from "$db/AccountDatabaseContext";
import type { ResetPasswordSchema } from "$data/schema/ResetPasswordSchema";
import { resetPasswordSchema } from "$data/schema/ResetPasswordSchema";

export const post: RequestHandler = async ({ request }) => {
    try {
        let params: ResetPasswordSchema = await request.json();
        if (!await resetPasswordSchema.isValid(params)) {
            return badRequest;
        }

        let existingUser = await AccountDatabaseContext.getFromEmail(params.email);
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