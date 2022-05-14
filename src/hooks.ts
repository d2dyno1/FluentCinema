import { dev } from "$app/env";
import type {GetSession, Handle} from "@sveltejs/kit";
import type { Settings } from "./db/Settings";
import {Session} from "./db/Session";

const requestCount = new Map<string, number>();

const resetInterval = 600000;
const maxRequests = 100;

export const handle: Handle = async ({ event, resolve }) => {
    // API rate limiting
    if (!dev && event.routeId != null && event.routeId.startsWith("api")) {
        let clientRequestCount = requestCount.has(event.clientAddress) ? requestCount.get(event.clientAddress) as number : 1;
        requestCount.set(event.clientAddress, ++clientRequestCount);
        if (clientRequestCount > maxRequests) {
            return new Response(JSON.stringify({
                success: false,
                message: "Too many requests"
            }), {
                status: 429,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }
    }

    if (event.routeId != null && !event.routeId.startsWith("api")) {
        let session = await Session.getFromRequest(event.request);
        if (session != null) {
            let user = await session.getUser();
            event.locals.session = {
                isLoggedIn: true,
                user: {
                    email: user.email,
                    username: user.username,
                    hasCustomProfilePicture: await user.picture != null,
                    settings: {...await user.getSettings()} as Settings
                }
            }
            return resolve(event);
        }
    }

    return resolve(event);
}

export const getSession: GetSession = (event) => {
    return event.locals.session ? event.locals.session : { isLoggedIn: false };
}

setInterval(() => {
    requestCount.clear();
}, resetInterval);