import * as fs from "fs";
import type {RequestHandler} from "@sveltejs/kit";
import {client, getUserBySession} from "../../../../lib/db";
import {getSessionFromRequest, isSessionValid} from "../../../../lib/auth/sessions";
import type {User} from "../../../../data/db/User";
import sharp from "sharp";
import {number, object} from "yup";
import type {InferType} from "yup";
import {badRequest} from "../../../../lib/responses";
const fsPromises = fs.promises;

const defaultSize = 32;

const currentPictureSchema = object({
    size: number().min(32).max(512).default(32)
});
interface CurrentPictureSchema extends InferType<typeof currentPictureSchema> {}

export const get: RequestHandler = async ({ url, request }) => {
    // @ts-ignore
    let size: number = url.searchParams.has("size") ? parseInt(url.searchParams.get("size")) : defaultSize;

    let params: CurrentPictureSchema = { size: size };
    if (!await currentPictureSchema.isValid(params)) {
        return badRequest;
    }

    let session = getSessionFromRequest(request);
    let imageBuffer = null;
    if (await isSessionValid(session)) {
        let user: User = await getUserBySession(session);
        let query = await client.query("SELECT picture FROM users WHERE id=$1;", [user.id]);
        imageBuffer = query.rows[0].picture;
    }

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
    } else {
        return {
            status: 200,
            body: await fsPromises.readFile("./node_modules/@fluentui/svg-icons/icons/person_32_filled.svg"),
            headers: {
                "Content-Type": "image/svg+xml"
            }
        }
    }
}