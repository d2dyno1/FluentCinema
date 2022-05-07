import { getUserFromSession, invalidateSessionId } from '$lib/db';
import { forbidden, badRequest, internalServerError } from "$lib/responses";
import { serialize, parse } from "cookie";

export async function get({ request }) {
    try {
        let session = parse(request.headers.get("cookie") || "").session;
        if (session == undefined) {
            return forbidden;
        }

        let user = await getUserFromSession(session);
        if (user == undefined) {
            return forbidden;
        }

        await invalidateSessionId(session);

        return {
            status: 200,
            body: {
                success: true
            },
            headers: {
                'Set-Cookie': serialize("session", "", {
                    maxAge: 0,
                    expires: new Date(),
                    path: "/"
                })
            }
        };
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}