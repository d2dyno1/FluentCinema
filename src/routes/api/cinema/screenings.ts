import type {RequestHandler} from "@sveltejs/kit";
import {Screening} from "$db/movie/Screening";

// @ts-ignore
export const get: RequestHandler = async ({ url, params }) => {
    let cinemaId = url.searchParams.has("cinemaId") ? url.searchParams.get("cinemaId") : null;
    let movieId = url.searchParams.has("movieId") ? url.searchParams.get("movieId") : null;
    return {
        status: 200,
        body: await Screening.getAll(cinemaId, movieId)
    }
}