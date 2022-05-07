import { getUser } from '$lib/db';
import { badRequest, forbidden, internalServerError, ok } from "$lib/responses";
import { verify } from "$lib/argon2";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest("");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequest("general.error.email.notAssociated");
        }

        if (!await verify(user.hashed_password, data.password)) {
            return forbidden("general.error.password.incorrect");
        }

        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}