import { getUser, createSessionId } from '$lib/db';
import { badRequest, forbidden, internalServerError, ok } from "$lib/responses";
import { verify } from "$lib/argon2";
var exports = {}; // dirty hack to make cookie work
import { serialize } from "cookie";

export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
            return badRequest("Missing credentials.");
        }

        let user = await getUser(data.email);
        if (user == undefined) {
            return badRequest("Account does not exist.");
        }

        if (!await verify(user.hashed_password, data.password)) {
            return forbidden("Incorrect password.");
        }

        const sessionId = await createSessionId(user);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        return {
            status: 200,
            body: {
                success: true,
                test: sessionId
            },
            headers: {
                'Set-Cookie': serialize("session", sessionId, {
                    expires: expiryDate,
                    path: "/"
                })
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}