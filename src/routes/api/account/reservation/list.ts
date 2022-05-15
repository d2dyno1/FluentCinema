import {forbidden} from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import {Session} from "$db/Session";

// @ts-ignore
export const get: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();

    return {
        status: 200,
        body: await user.getReservations()
    };
}