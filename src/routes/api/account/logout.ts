import { forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";

export const post: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
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
            "Set-Cookie": SessionDatabaseContext.generateEmptyCookie()
        }
    };
}