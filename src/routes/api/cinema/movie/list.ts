import { client } from "$db";
import type {RequestHandler} from "@sveltejs/kit";

export const get: RequestHandler = async () => {
    return {
        status: 200,
        body: (await client.query("SELECT * FROM movies")).rows
    }
}