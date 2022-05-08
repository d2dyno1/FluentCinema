import * as fs from "fs";
import type {RequestHandler} from "@sveltejs/kit";
import {client, getUserBySession} from "../../../../lib/db";
import {getSessionFromRequest, isSessionValid} from "../../../../lib/auth/sessions";
import type {User} from "../../../../data/db/User";
import sharp from "sharp";
const fsPromises = fs.promises;

const defaultSize = 32;

export const get: RequestHandler = async ({ url, request }) => {
    let session = getSessionFromRequest(request);
    let imageBuffer;
    if (await isSessionValid(session)) {
        let user: User = await getUserBySession(session);
        let query = await client.query("SELECT picture FROM users WHERE id=$1;", [user.id]);
        imageBuffer = query.rows[0].picture;
    } else {
        imageBuffer = await fsPromises.readFile("./static/images/defaultProfilePicture.png");
    }
    // @ts-ignore
    let size = url.searchParams.has("size") ? parseInt(url.searchParams.get("size")) : defaultSize;
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