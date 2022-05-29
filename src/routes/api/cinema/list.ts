import type { RequestHandler } from "@sveltejs/kit";
import { CinemaController } from "$db/CinemaController";
import type { Cinema } from "$api/Cinema";

export const get: RequestHandler<any, any[]> = async () => {
    return {
        status: 200,
        body: (await CinemaController.getAll()).map(cinema => cinema.toApiContext()) as Cinema[]
    }
}