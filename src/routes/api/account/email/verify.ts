import {badRequest, internalServerError, missingParameters, ok} from "../../../../lib/responses";
import {isTokenValid, verifyEmail} from "../../../../lib/auth/emailverification";
import type { RequestHandler } from "@sveltejs/kit";
import type {VerifyEmailParams} from "../../../../data/params/VerifyEmailParams";
import {object, string} from "yup";
import type {InferType} from "yup";
import {emailValidationRegex} from "../../../../lib/validation";

const verifyEmailSchema = object({
    token: string().required()
});
interface VerifyEmailSchema extends InferType<typeof verifyEmailSchema> {}

export const post: RequestHandler = async ({ request }) => {
    try {
        let params: VerifyEmailSchema = await request.json();
        if (!await verifyEmailSchema.isValid(params)) {
            return badRequest;
        }

        if (!await isTokenValid(params.token)) {
            return badRequest;
        }
        await verifyEmail(params.token);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}