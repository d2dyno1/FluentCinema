import { client } from "$db";
import type {RequestHandler} from "@sveltejs/kit";
import type {MovieData} from "$data/movies";

export const get: RequestHandler<any> = async ({ params }) => {
    let query = await client.query("SELECT * FROM movies WHERE id=$1;", [params.id]);
    let rows: MovieData[] = query.rows;

    return {
        status: 200,
        body: rows[0]
    }
}