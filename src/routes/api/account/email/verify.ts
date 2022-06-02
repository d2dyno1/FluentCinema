import { badRequest, forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import { EmailVerificationController } from "$db/EmailVerificationController";
import { verifyEmailSchema } from "$data/schema/VerifyEmailSchema";
import type { VerifyEmailSchema } from "$data/schema/VerifyEmailSchema";

export const post: RequestHandler = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: VerifyEmailSchema = await request.json();
    if (!await verifyEmailSchema.isValid(params)) {
        return badRequest;
    }

    let user = await session.getUser();
    if (await EmailVerificationController.tryVerifyEmail(user, params.token)) {
        return ok;
    }
    return badRequest;
}