import {badRequest, internalServerError, ok} from "../../lib/responses";
import {isTokenValid, verifyEmail} from "../../lib/auth/emailverification";


export async function post({ request }) {
    try {
        const data = await request.json();
        if (!data.hasOwnProperty("token")) {
            return badRequest;
        }

        let token = data.token;
        if (!await isTokenValid(token)) {
            return badRequest;
        }
        await verifyEmail(token);


        return ok;
    } catch (e) {
        console.log(e);
        return internalServerError;
    }
}