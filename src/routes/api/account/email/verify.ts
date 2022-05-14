import {badRequest, forbidden, ok} from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import {Session} from "$db/Session";
import {EmailVerification} from "$db/EmailVerification";
import {verifyEmailSchema} from "$data/schema/VerifyEmailSchema";
import type {VerifyEmailSchema} from "$data/schema/VerifyEmailSchema";

export const post: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: VerifyEmailSchema = await request.json();
    if (!await verifyEmailSchema.isValid(params)) {
        return badRequest;
    }

    let user = await session.getUser();
    if (await EmailVerification.tryVerifyEmail(user, params.token)) {
        return ok;
    }

    return badRequest;
}