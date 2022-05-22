import { badRequest, badRequestWithMessage, forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { createReservationSchema } from "$data/schema/CreateReservationSchema";
import type { CreateReservationSchema } from "$data/schema/CreateReservationSchema"
import { ScreeningDatabaseContext } from "$db/ScreeningDatabaseContext";
import { ReservationDatabaseContext } from "$db/ReservationDatabaseContext";

export const post: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: CreateReservationSchema = await request.json();
    if (!await createReservationSchema.isValid(params)) {
        return badRequest;
    }

    let screening = await ScreeningDatabaseContext.getFromId(params.screeningId);
    if (screening == null) {
        return badRequest;
    }

    if (params.seat > screening.room.seatRowCount * screening.room.seatRowLength) {
        return badRequestWithMessage("Invalid seat.");
    } else if (screening.reservedSeats.indexOf(params.seat) != -1) {
        return badRequestWithMessage("This seat is already taken.");
    }

    await ReservationDatabaseContext.create(await session.getUser(), params.screeningId, params.seat);
    return ok;
}