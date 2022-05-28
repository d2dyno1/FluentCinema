import { badRequest, forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import type { ReservationApiContext } from "$api/ReservationApiContext";
import { EmailVerificationDatabaseContext } from "$db/EmailVerificationDatabaseContext";

// @ts-ignore
export const post: RequestHandler<any, ReservationApiContext> = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();
    if (user.is_verified) {
        return badRequest;
    }
    await EmailVerificationDatabaseContext.beginVerification(user);
    return ok;
}