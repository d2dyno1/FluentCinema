import { forbidden, ok } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";

export const del: RequestHandler = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }
    let user = await session.getUser();
    await user.delete();
    return ok;
}