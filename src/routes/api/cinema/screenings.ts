import type {RequestHandler} from "@sveltejs/kit";
import {Screening} from "$db/movie/Screening";
import type {ScreeningResponse} from "$data/response/ScreeningResponse";

// @ts-ignore
export const get: RequestHandler<any, ScreeningResponse[]> = async ({ url, params }) => {
    let cinemaId = url.searchParams.has("cinemaId") ? url.searchParams.get("cinemaId") : null;
    let movieId = url.searchParams.has("movieId") ? url.searchParams.get("movieId") : null;
    return {
        status: 200,
        body: await Screening.getAll(cinemaId, movieId)
    }
}