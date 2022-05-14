import { client } from "$db";
import type {RequestHandler} from "@sveltejs/kit";
import type {Screening} from "$data/cinema/Screening";

export type params = {
    movieId?: string,
    cinemaId?: string;
}

export const get: RequestHandler<params, any> = async ({ url }) => {
    let movieId = url.searchParams.get("movieId");
    let cinemaId = url.searchParams.get("cinemaId");

    let screenings: Screening[] = (await client.query(`
        SELECT
            screenings.*,
            row_to_json(movies.*) as movie,
            row_to_json(screening_rooms.*) as room
        FROM screenings
        JOIN movies ON movies.id = screenings."movieId"
        JOIN screening_rooms ON screening_rooms.id = screenings."roomId"
        `)).rows;
    if (movieId != null) {
        screenings = screenings.filter(screening => screening.movie.id == parseInt(movieId as string));
    }
    if (cinemaId != null) {
        screenings = screenings.filter(screening => screening.cinema.id == parseInt(cinemaId as string));
    }

    return {
        status: 200,
        body: screenings
    }
}