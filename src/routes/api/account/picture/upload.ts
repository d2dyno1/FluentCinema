import type {RequestHandler} from "@sveltejs/kit";
import {badRequest, forbidden, internalServerError} from "../../../../lib/responses";
import {client, getUserBySession} from "../../../../lib/db";
import {getSessionFromRequest, isSessionValid} from "../../../../lib/auth/sessions";
import type {User} from "../../../../data/User";
import sharp from "sharp";

const maxPictureSize = 200000;

export const put: RequestHandler = async ({ request }) => {
    try {
        let session = getSessionFromRequest(request);
        if (!await isSessionValid(session)) {
            return forbidden;
        }

        let buffer = new Uint8Array(await request.arrayBuffer());
        if (buffer.byteLength > maxPictureSize) {
            return badRequest;
        }
        let processedImageBuffer = await sharp(buffer)
            .resize(32)
            .png()
            .toBuffer();

        let user: User = await getUserBySession(session);
        await client.query("UPDATE users SET picture=$1 WHERE id=$2;", [processedImageBuffer, user.id]);

        return {
            status: 200
        }
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}