import type {RequestHandler} from "@sveltejs/kit";
import {badRequest} from "$api/responses";;
import {Movie} from "$db/movie/Movie";

export const get: RequestHandler = async ({ params }) => {
    let movie = await Movie.getFromId(parseInt(params.id));
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