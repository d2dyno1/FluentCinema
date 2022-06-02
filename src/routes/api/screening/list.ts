import type { RequestHandler } from "@sveltejs/kit";
import { ScreeningController } from "$db/ScreeningController";

// @ts-ignore
export const get: RequestHandler<any, ScreeningResponse[]> = async ({ url, params }) => {
    let cinemaId = url.searchParams.has("cinemaId") ? url.searchParams.get("cinemaId") : null;
    let movieId = url.searchParams.has("movieId") ? url.searchParams.get("movieId") : null;
    return {
        status: 200,
        body: (await ScreeningController.getAll(cinemaId, movieId)).map(screening => screening.toApiContext())
    }
}