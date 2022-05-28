import { object } from "yup";
import type { InferType } from "yup";
import { emailSchema } from "$api/validation";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { badRequest, badRequestWithMessage, forbidden, ok } from "$api/responses";
import { AccountDatabaseContext } from "$db/AccountDatabaseContext";

const schema = object({
    email: emailSchema
});

interface Schema extends InferType<typeof schema> {}

export const put: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: Schema = await request.json();
    if (!await schema.isValid(params)) {
        return badRequest;
    }

    if (await AccountDatabaseContext.getFromEmail(params.email)) {
        return badRequestWithMessage("This e-mail address is already in use.");
    }
    await (await session.getUser()).changeEmail(params.email);
    return ok;
}