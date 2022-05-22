import type { RequestHandler } from "@sveltejs/kit";
import { badRequest, ok } from "$api/responses";
import { AccountDatabaseContext } from "$db/AccountDatabaseContext";

// @ts-ignore
export const get: RequestHandler = async ({ params }) => {
    let userId = params.id;
    let user = await AccountDatabaseContext.getFromId(userId);
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