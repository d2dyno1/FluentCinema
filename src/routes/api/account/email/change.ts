import { object } from "yup";
import type { InferType } from "yup";
import { emailSchema } from "$api/validation";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import { badRequest, badRequestWithMessage, forbidden, ok } from "$api/responses";
import { AccountController } from "$db/AccountController";

const schema = object({
    email: emailSchema
});

interface Schema extends InferType<typeof schema> {}

export const put: RequestHandler = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: Schema = await request.json();
    if (!await schema.isValid(params)) {
        return badRequest;
    }

    if (await AccountController.getFromEmail(params.email)) {
        return badRequestWithMessage("This e-mail address is already in use.");
    }
    await (await session.getUser()).changeEmail(params.email);
    return ok;
}