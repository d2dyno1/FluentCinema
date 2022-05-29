import type { RequestHandler } from "@sveltejs/kit";
import type { Movie } from "$api/Movie";
import { MovieController } from "$db/MovieController";

// @ts-ignore
export const get: RequestHandler<any, Movie[]> = async ({ params }) => {
    return {
        status: 200,
        body: (await (await MovieController.getFromId(params.id)).getReviews()).map(review => review.toApiContext())
    }
}