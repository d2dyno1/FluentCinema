import * as fs from "fs";
import type {RequestHandler} from "@sveltejs/kit";
import {client, getUserBySession} from "../../../../lib/db";
import {getSessionFromRequest, isSessionValid} from "../../../../lib/auth/sessions";
import type {User} from "../../../../data/User";
const fsPromises = fs.promises;

export const get: RequestHandler = async ({ request }) => {
    let session = getSessionFromRequest(request);
    if (!await isSessionValid(session)) {
        return {
            status: 200,
            body: await fsPromises.readFile("./static/images/defaultProfilePicture.png"),
            headers: {
                "Content-Type": "image/png"
            }
        }
    }

    let user: User = await getUserBySession(session);
    let picture = await client.query("SELECT picture::bytea FROM users WHERE id=$1;", [user.id]);
    return {
        status: 200,
        body: picture.rows[0].picture,
        headers: {
            "Content-Type": "image/png"
        }
    }
}