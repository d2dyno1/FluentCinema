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

    let reservedSeats = await screening.getReservedSeats();
    let maxSeat = screening.seatRowCount * screening.seatRowLength;
    let user = await session.getUser();
    for (let seat of params.seats) {
        if (reservedSeats.indexOf(seat!) != -1) {
            return badRequestWithMessage(`Seat ${seat} is already reserved.`);
        } else if (seat! > maxSeat) {
            return badRequest;
        }
        await ReservationController.create(user, params.screeningId, seat!);
    }
    return ok;
}