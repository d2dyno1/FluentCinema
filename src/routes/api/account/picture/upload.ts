import type { RequestHandler } from "@sveltejs/kit";
import { badRequest, forbidden, internalServerError } from "$api/responses";
import sharp from "sharp";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";

const maxPictureSize = 200000;

export const put: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let buffer = new Uint8Array(await request.arrayBuffer());
    if (buffer.byteLength > maxPictureSize) {
        return badRequest;
    }
    let processedImageBuffer = await sharp(buffer)
        .resize(512)
        .png()
        .toBuffer();

    let user = await session.getUser();
    await user.changePicture(processedImageBuffer);

    return {
        status: 200
    }
}