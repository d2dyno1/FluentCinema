import type { InferType } from "yup";
import { object } from "yup";
import { passwordSchema } from "$api/validation";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionController } from "$db/SessionController";
import { badRequest, forbidden, ok } from "$api/responses";

const schema = object({
    password: passwordSchema
});

interface Schema extends InferType<typeof schema> {}

export const put: RequestHandler<any, any> = async ({ request }) => {
    let session = await SessionController.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: Schema = await request.json();
    if (!await schema.isValid(params)) {
        return badRequest;
    }

    let user = await session.getUser();
    await user.changePassword(params.password);
    return ok;
}