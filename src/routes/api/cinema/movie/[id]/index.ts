import { client } from "$db";
import type {RequestHandler} from "@sveltejs/kit";
import type {Movie} from "$db/movie/Movie";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    let query = await client.query("SELECT * FROM movies WHERE id=$1;", [params.id]);
    let rows: Movie[] = query.rows;

    return {
        status: 200,
        body: rows[0]
    }
}