import {getUser} from '$lib/database/db';
import {badRequest, forbidden, internalServerError, ok} from "../../lib/responses";
import { verify } from "$lib/argon2";

export async function post({ request }) {
    try {
        const data = await request.json();

        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest("Missing credentials.");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequest("Account does not exist.");
        } else {
            if (!await verify(user.hashed_password, data.password)) {
                return forbidden("Incorrect password.");
            }
            return ok;
        }
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}