import { badRequest, forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import type { Reservation } from "$api/Reservation";
import { EmailVerificationController } from "$db/EmailVerificationController";

// @ts-ignore
export const post: RequestHandler<any, Reservation> = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();
    if (user.is_verified) {
        return badRequest;
    }
    await EmailVerificationController.beginVerification(user);
    return ok;
}