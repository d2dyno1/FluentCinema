import {client, getUser} from '$lib/database/db';
import {badRequest, forbidden, internalServerError, ok} from "../../lib/responses";
import { verify } from "$lib/argon2";

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