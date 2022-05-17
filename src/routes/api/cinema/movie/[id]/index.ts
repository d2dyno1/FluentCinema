import type {RequestHandler} from "@sveltejs/kit";
import {Movie} from "$db/movie/Movie";
import type {MovieResponse} from "$data/response/MovieResponse";

// @ts-ignore
export const get: RequestHandler<any, MovieResponse> = async ({ params }) => {
    return {
        status: 200,
        body: await Movie.getFromId(params.id)
    }
}