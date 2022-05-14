import type {RequestHandler} from "@sveltejs/kit";
import sharp from "sharp";
import {number, object} from "yup";
import type {InferType} from "yup";
import {badRequest, forbidden} from "$api/responses";
import {Session} from "$db/Session";

const defaultSize = 32;

const currentPictureSchema = object({
    size: number().min(32).max(512).default(32)
});
interface CurrentPictureSchema extends InferType<typeof currentPictureSchema> {}

export const get: RequestHandler = async ({ url, request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    // @ts-ignore
    let size: number = url.searchParams.has("size") ? parseInt(url.searchParams.get("size")) : defaultSize;

    let params: CurrentPictureSchema = { size: size };
    if (!await currentPictureSchema.isValid(params)) {
        return badRequest;
    }

    let imageBuffer = (await session.getUser()).picture;

    if (imageBuffer != null) {
        let processedImageBuffer = await sharp(imageBuffer)
            .resize(size)
            .png()
            .toBuffer();

        return {
            status: 200,
            body: processedImageBuffer,
            headers: {
                "Content-Type": "image/png"
            }
        }
    }
    return badRequest;
}