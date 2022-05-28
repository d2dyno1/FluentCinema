import type { RequestHandler } from "@sveltejs/kit";
import { MovieDatabaseContext } from "$db/MovieDatabaseContext";
import type { MovieApiContext } from "$api/MovieApiContext";

// @ts-ignore
export const get: RequestHandler<any, MovieApiContext[]> = async () => {
    return {
        status: 200,
        body: (await MovieDatabaseContext.getAll()).map(movie => movie.toApiContext())
    }
}