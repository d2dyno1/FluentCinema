import { forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";

export const post: RequestHandler = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
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
            "Set-Cookie": SessionController.generateEmptyCookie()
        }
    };
}