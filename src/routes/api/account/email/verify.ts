import {badRequest, internalServerError, missingParameters, ok} from "../../../../lib/responses";
import {isTokenValid, verifyEmail} from "../../../../lib/auth/emailverification";
import type { RequestHandler } from "@sveltejs/kit";
import type {VerifyEmailParams} from "../../../../data/params/VerifyEmailParams";


export const post: RequestHandler = async ({ request }) => {
    try {
        let params: VerifyEmailParams = await request.json();
        if (params.token == null) {
            return missingParameters;
        }

        let token = params.token;
        if (!await isTokenValid(token)) {
            return badRequest;
        }
        await verifyEmail(token);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}