import {client, getUser, getUserBySession} from '../../../lib/db';
import {badRequestWithMessage, forbidden, forbiddenWithMessage, internalServerError, ok} from "../../../lib/responses";
import { verify } from "../../../lib/auth/argon2";
import type {RequestHandler} from "@sveltejs/kit";
import {getSessionFromRequest, isSessionValid} from "../../../lib/auth/sessions";

export const del: RequestHandler = async ({ request }) => {
    try {
        let session = getSessionFromRequest(request);
        if (!await isSessionValid(session)) {
            return forbidden;
        }
        let user = await getUserBySession(session);
        if (user == null) {
            return forbidden;
        }

        await client.query("DELETE FROM users WHERE id=$1", [user.id]);
        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}