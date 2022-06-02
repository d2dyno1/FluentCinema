import type { RequestHandler } from "@sveltejs/kit";
import { ScreeningController } from "$db/ScreeningController";
import { badRequest } from "$api/responses";

export const get: RequestHandler<any, any> = async ({ params }) => {
    let screening = await ScreeningController.getFromId(params.id);
    if (screening == null) {
        return badRequest;
    }
    return {
        status: 200,
        body: await screening.getReservedSeats()
    }
}