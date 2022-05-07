import {client, getUser} from '$lib/db';
import {badRequest, forbidden, internalServerError, ok} from "$lib/responses";
import { verify } from "$lib/argon2";

export async function del({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest("Missing credentials.");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequest("This e-mail address is not associated with any account.");
        }

        if (!await verify(user.hashed_password, data.password)) {
            return forbidden("Incorrect password.");
        }

        await client.query("DELETE FROM users WHERE id=$1", [user.id]);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}