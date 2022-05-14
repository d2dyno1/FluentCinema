import {forbidden, ok} from "$api/responses";
import type {RequestHandler} from "@sveltejs/kit";
import {Session} from "$db/Session";

export const del: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();
    await user.delete();
    return ok;
}