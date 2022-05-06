import { getUser } from "$lib/database/db";
import {badRequest, internalServerError, ok} from "$lib/responses";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email")) {
            return badRequest("Missing credentials.");
        }

        let existingUser = await getUser(data.email);
        if (existingUser == undefined) {
            return badRequest("This e-mail address is not associated with any account.");
        }

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}