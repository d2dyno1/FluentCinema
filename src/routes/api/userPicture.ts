import * as fs from "fs";
const fsPromises = fs.promises;

export async function get({ request }) {
    let picture = await fsPromises.readFile("./static/images/defaultProfilePicture.png");

    return {
        status: 200,
        body: picture,
        headers: {
            "Content-Type": "image/png"
        }
    }
}