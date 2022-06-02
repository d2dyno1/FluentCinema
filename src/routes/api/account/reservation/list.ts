import { forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import type { Reservation } from "$api/Reservation";

// @ts-ignore
export const get: RequestHandler<any, Reservation> = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();

    return {
        status: 200,
        body: (await user.getReservations()).map(reservation => reservation.toApiContext())
    };
}