import type { RequestHandler } from "@sveltejs/kit";
import { MovieController } from "$db/MovieController";
import { badRequest } from "$api/responses";

export const get: RequestHandler<any, any> = async ({ params }) => {
    let movie = await MovieController.getFromId(params.id);
    if (!movie) {
        return badRequest;
    }
    return {
        status: 200,
        body: movie.toApiContext()
    }
}