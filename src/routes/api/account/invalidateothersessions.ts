import { forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";

export const del: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    await session.invalidateOtherSessions();
    return ok;
}