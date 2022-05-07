import { client } from '$lib/db';
import { internalServerError } from "$lib/responses";

export async function get({ request }) {
    try {
        const movies = await client.query("SELECT * FROM movies");
        return {
            status: 200,
            body: movies.rows
        }
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}