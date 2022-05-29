import type { RequestHandler } from "@sveltejs/kit";
import { badRequest } from "$api/responses";
import { MovieController } from "$db/MovieController";

export const get: RequestHandler = async ({ params }) => {
    let movie = await MovieController.getFromId(params.id);
    if (movie == null) {
        return badRequest;
    }
    return {
        status: 200,
        body: movie.posterImage,
        headers: {
            "Content-Type": "image/jpg"
        }
    }
}