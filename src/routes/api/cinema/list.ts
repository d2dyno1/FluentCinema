import type { RequestHandler } from "@sveltejs/kit";
import { CinemaDatabaseContext } from "$db/CinemaDatabaseContext";
import type { CinemaApiContext } from "$api/CinemaApiContext";

export const get: RequestHandler<any, any[]> = async () => {
    return {
        status: 200,
        body: (await CinemaDatabaseContext.getAll()).map(cinema => cinema.toApiContext()) as CinemaApiContext[]
    }
}