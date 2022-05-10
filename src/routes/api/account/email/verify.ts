import {badRequest, forbidden, ok} from "../../../../lib/responses";
import type { RequestHandler } from "@sveltejs/kit";
import {object, string} from "yup";
import type {InferType} from "yup";
import {Session} from "../../../../lib/db/Session";
import {User} from "../../../../lib/db/User";
import {EmailVerification} from "../../../../lib/db/EmailVerification";

const verifyEmailSchema = object({
    token: string().required()
});
interface VerifyEmailSchema extends InferType<typeof verifyEmailSchema> {}

export const post: RequestHandler = async ({ request }) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: VerifyEmailSchema = await request.json();
    if (!await verifyEmailSchema.isValid(params)) {
        return badRequest;
    }

    let user = await session.getUser();
    if (await EmailVerification.tryVerifyEmail(user, params.token)) {
        return ok;
    }

    return badRequest;
}