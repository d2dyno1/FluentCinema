import { dev } from "$app/env";
import { parse } from "cookie";
import {getUserBySession} from "../lib/db";
import type {Session} from "../data/Session";
import type {User} from "../data/db/User";
// import type {GetSession} from "@sveltejs/kit";

const rateLimitedEndpoints = [
    "api/login",
    "api/register"
];

const requestCount = new Map<string, number>();

const resetInterval = 600000;
const maxRequests = 10;

// TODO move rate limiting and sessions into separate files if possible
export async function handle({ event, resolve }) {
    // Rate limiting
    if (!dev && rateLimitedEndpoints.indexOf(event.routeId) != -1) {
        // @ts-ignore
        let clientRequestCount: number = requestCount.has(event.clientAddress) ? requestCount.get(event.clientAddress) : 1;
        requestCount.set(event.clientAddress, ++clientRequestCount);
        if (clientRequestCount > maxRequests) {
            return new Response(JSON.stringify({success: false, message: "Too many requests"}), {
                status: 429,
                headers: {
                    "Content-type": "application/json"
                }
            })
        }
    }

    // Session
    const cookies = parse(event.request.headers.get("cookie") || '');
    if (cookies.session) {
        const user: User = await getUserBySession(cookies.session);
        if (user != null) {
            let session: Session = {
                isLoggedIn: true,
                user: {
                    email: user.email,
                    username: user.username
                }
            }
            event.locals.session = session;
            return await resolve(event);
        }
    }

    event.locals.session = null;

    return await resolve(event);
}

export const getSession: GetSession = (event) => {
    // @ts-ignore
    return event.locals.session ? event.locals.session : { isLoggedIn: false};
}

setInterval(() => {
    requestCount.clear();
}, resetInterval);