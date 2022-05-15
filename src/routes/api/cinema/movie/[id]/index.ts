import type {RequestHandler} from "@sveltejs/kit";
import {Movie} from "$db/movie/Movie";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    return {
        status: 200,
        body: await Movie.getFromId(params.id)
    }
}