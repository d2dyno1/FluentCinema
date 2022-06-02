import type { RequestHandler } from "@sveltejs/kit";
import { MovieController } from "$db/MovieController";
import type { Movie } from "$api/Movie";

// @ts-ignore
export const get: RequestHandler<any, Movie[]> = async () => {
    return {
        status: 200,
        body: (await MovieController.getAll()).map(movie => movie.toApiContext())
    }
}