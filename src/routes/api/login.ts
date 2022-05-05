import {getUser} from '$lib/database/db';
import { badRequest } from "$lib/api";
import { verify } from "$lib/argon2";

export async function post({ request }) {
    const data = await request.json();

    if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
        return badRequest("Missing credentials.");
    }

    let user = await getUser(data.email);
    if (user == undefined) {
        return badRequest("Account does not exist.");
    } else {
        if (!await verify(user.hashed_password, data.password)) {
            return {
                status: 403,
                body: {
                    success: false,
                    errorMessage: "Incorrect password."
                }
            }
        }

        return {
            status: 200,
            body: {
                success: true
            }
        }
    }
}