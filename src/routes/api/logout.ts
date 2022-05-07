import { getUserBySession } from '$lib/db';
import {getSessionFromRequest, invalidateSession, isSessionValid} from "../../lib/auth/sessions";
import { forbidden, internalServerError } from "$lib/responses";
import { serialize, parse } from "cookie";
import {generateEmptySessionCookie} from "../../lib/auth/sessions";

export async function get({ request }) {
    try {
        let session = getSessionFromRequest(request);
        if (!await isSessionValid(session)) {
            return forbidden;
        }

        let user = await getUserBySession(session);
        if (user == undefined) {
            return forbidden;
        }

        await invalidateSession(session);
        return {
            status: 200,
            body: {
                success: true
            },
            headers: {
                "Set-Cookie": generateEmptySessionCookie()
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}