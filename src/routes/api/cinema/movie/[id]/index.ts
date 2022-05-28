import type { RequestHandler } from "@sveltejs/kit";
import type { MovieApiContext } from "$api/MovieApiContext";
import { MovieDatabaseContext } from "$db/MovieDatabaseContext";

// @ts-ignore
export const get: RequestHandler<any, MovieApiContext> = async ({ params }) => {
    return {
        status: 200,
        body: (await MovieDatabaseContext.getFromId(params.id)).toApiContext()
    }
}