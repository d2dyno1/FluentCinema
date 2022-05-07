import { dev } from "$app/env";

const rateLimitedEndpoints = [
    "api/login",
    "api/register"
];

const requestCount = new Map<string, number>();

const resetInterval = 600000;
const maxRequests = 10;

export async function handle({ event, resolve }) {
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

    return await resolve(event);
}

setInterval(() => {
    requestCount.clear();
}, resetInterval);