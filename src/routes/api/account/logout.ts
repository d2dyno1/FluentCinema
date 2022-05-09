import { getUserBySession } from '../../../lib/db';
import {getSessionFromRequest, invalidateSession, isSessionValid} from "../../../lib/auth/sessions";
import { forbidden, internalServerError } from "../../../lib/responses";
import { serialize, parse } from "cookie";
import {generateEmptySessionCookie} from "../../../lib/auth/sessions";
import type {RequestHandler} from "@sveltejs/kit";

export const post: RequestHandler = async ({ request }) => {
    let session = getSessionFromRequest(request);
    if (!await isSessionValid(session) || await getUserBySession(session) == null) {
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
}