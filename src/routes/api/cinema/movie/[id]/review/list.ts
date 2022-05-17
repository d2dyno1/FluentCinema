import type {RequestHandler} from "@sveltejs/kit";
import {Movie} from "$db/movie/Movie";
import type {ReviewResponse} from "$data/response/ReviewResponse";

// @ts-ignore
export const get: RequestHandler<any, ReviewResponse[]> = async ({ params }) => {
    return {
        status: 200,
        body: await (await Movie.getFromId(params.id)).getReviews()
    }
}