import { forbidden } from "../../../lib/responses";
import type {RequestHandler} from "@sveltejs/kit";
import {Session} from "../../../lib/db/Session";

export const post: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    await session.invalidate();
    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            "Set-Cookie": Session.generateEmptyCookie()
        }
    };
}