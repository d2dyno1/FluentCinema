import { getUser } from "$lib/db";
import {badRequest, badRequestWithMessage, internalServerError, ok} from "$lib/responses";
import type {RequestHandler} from "@sveltejs/kit";
import {string, object} from "yup";
import type {InferType} from "yup";
import {emailValidationRegex} from "../../../../lib/validation";

const resetPasswordSchema = object({
    email: string().required().matches(emailValidationRegex)
});
interface ResetPasswordSchema extends InferType<typeof resetPasswordSchema> {}

export const post: RequestHandler = async ({ request }) => {
    try {
        let params: ResetPasswordSchema = await request.json();
        if (!await resetPasswordSchema.isValid(params)) {
            return badRequest;
        }

        let existingUser = await getUser(params.email);
        if (existingUser == undefined) {
            return badRequestWithMessage("This e-mail address is not associated with any account.");
        }

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}