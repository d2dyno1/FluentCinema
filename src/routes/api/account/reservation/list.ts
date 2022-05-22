import { forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import type { ReservationApiContext } from "$api/ReservationApiContext";

// @ts-ignore
export const get: RequestHandler<any, ReservationApiContext> = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();

    return {
        status: 200,
        body: (await user.getReservations()).map(reservation => reservation.toApiContext())
    };
}