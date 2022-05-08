import * as fs from "fs";
import type {RequestHandler} from "@sveltejs/kit";
const fsPromises = fs.promises;

export const get: RequestHandler = async () => {
    let picture = await fsPromises.readFile("./static/images/defaultProfilePicture.png");

    return {
        status: 200,
        body: picture,
        headers: {
            "Content-Type": "image/png"
        }
    }
}