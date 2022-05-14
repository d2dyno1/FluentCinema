import type {RequestHandler} from "@sveltejs/kit";
import sharp from "sharp";
import {badRequest, ok} from "$api/responses";
import {User} from "$db/User";

export const get: RequestHandler = async ({ params }) => {
    let userId = params.id;
    let user = await User.getFromId(userId);
    if (user == null) {
        return badRequest;
    }

    if (user.picture != null) {
        return {
            status: 200,
            body: user.picture,
            headers: {
                "Content-Type": "image/png"
            }
        }
    }
    return ok;
}