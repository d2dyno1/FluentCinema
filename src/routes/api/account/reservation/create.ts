import { badRequest, badRequestWithMessage, forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import { createReservationSchema } from "$data/schema/CreateReservationSchema";
import type { CreateReservationSchema } from "$data/schema/CreateReservationSchema"
import { ScreeningController } from "$db/ScreeningController";
import { ReservationController } from "$db/ReservationController";

export const post: RequestHandler = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: CreateReservationSchema = await request.json();
    if (!await createReservationSchema.isValid(params)) {
        return badRequest;
    }

    let screening = await ScreeningController.getFromId(params.screeningId);
    if (screening == null) {
        return badRequest;
    }

    if (params.seat > screening.seatRowCount * screening.seatRowLength) {
        return badRequestWithMessage("Invalid seat.");
    } else if ((await screening.getReservedSeats()).indexOf(params.seat) != -1) {
        return badRequestWithMessage("This seat is already taken.");
    }

    await ReservationController.create(await session.getUser(), params.screeningId, params.seat);
    return ok;
}