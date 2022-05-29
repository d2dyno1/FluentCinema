import type { RequestHandler } from "@sveltejs/kit";
import { badRequest, ok } from "$api/responses";
import { AccountController } from "$db/AccountController";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    let userId = params.id;
    let user = await AccountController.getFromId(userId);
    if (user == null) {
        return badRequest;
    }

    let picture = await user.picture;
    if (picture != null) {
        return {
            status: 200,
            body: picture,
            headers: {
                "Content-Type": "image/png"
            }
        }
    }
    return ok;
}