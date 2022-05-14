import { client } from "$db";
import { internalServerError } from "$api/responses";
import type {RequestHandler} from "@sveltejs/kit";
import type {MovieData} from "$data/movies";

export const get: RequestHandler = async () => {
    try {
        let query = await client.query("SELECT * FROM movies");
        let rows: MovieData[] = query.rows;

        return {
            status: 200,
            body: rows
        }
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}