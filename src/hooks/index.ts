import { dev } from "$app/env";
import { parse } from "cookie";
import {getUserFromSession} from "../lib/db";

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
        const user = await getUserFromSession(cookies.session);
        if (user != undefined) {
            event.locals.user = {
                email: user.email,
                username: user.username
            }
            return await resolve(event);
        }
    }

    event.locals.user = null;

    return await resolve(event);
}

export function getSession(event) {
    return event.locals.user
        ? {
            user: {
                email: event.locals.user.email,
                username: event.locals.user.username
            }
        }
        : {};
}

setInterval(() => {
    requestCount.clear();
}, resetInterval);