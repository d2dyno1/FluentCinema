import type { RequestHandler } from "@sveltejs/kit";
import { badRequest } from "$api/responses";
import { MovieDatabaseContext } from "$db/MovieDatabaseContext";

export const get: RequestHandler = async ({ params }) => {
    let movie = await MovieDatabaseContext.getFromId(params.id);
    if (movie == null) {
        return badRequest;
    }
    return {
        status: 200,
        body: movie.bannerImage,
        headers: {
            "Content-Type": "image/jpg"
        }
    }
}