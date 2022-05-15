import {badRequest, badRequestWithMessage, forbidden, ok} from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { Session } from "$db/Session";
import {createReservationSchema} from "$data/schema/CreateReservationSchema";
import type {CreateReservationSchema} from "$data/schema/CreateReservationSchema"
import {Screening} from "$db/movie/Screening";
import {Reservation} from "$db/movie/Reservation";

export const post: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: CreateReservationSchema = await request.json();
    if (!await createReservationSchema.isValid(params)) {
        return badRequest;
    }

    let screening = await Screening.getFromId(params.screeningId);
    if (screening == null) {
        return badRequest;
    }

    if (params.seat > screening.room.seatRowCount * screening.room.seatRowLength) {
        return badRequestWithMessage("Invalid seat.");
    } else if (screening.takenSeats.indexOf(params.seat) != -1) {
        return badRequestWithMessage("This seat is already taken.");
    }

    await Reservation.create(await session.getUser(), params.screeningId, params.seat);
    return ok;
}