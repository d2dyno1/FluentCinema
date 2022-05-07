import {client, getUser} from '$lib/db';
import {badRequestWithMessage, forbiddenWithMessage, internalServerError, ok} from "$lib/responses";
import { verify } from "../../lib/auth/argon2";

export async function del({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequestWithMessage("Missing credentials.");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequestWithMessage("This e-mail address is not associated with any account.");
        }

        if (!await verify(user.hashed_password, data.password)) {
            return forbiddenWithMessage("Incorrect password.");
        }

        await client.query("DELETE FROM users WHERE id=$1", [user.id]);

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}