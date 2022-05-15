import type {RequestHandler} from "@sveltejs/kit";
import {badRequest, ok} from "$api/responses";
import {User} from "$db/User";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    let userId = params.id;
    let user = await User.getFromId(userId);
    if (user == null) {
        return badRequest;
    }

    let picture = await user.getPicture();
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