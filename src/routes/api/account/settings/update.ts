import { badRequest, ok, forbidden } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { settingsSchema } from "$data/schema/SettingsSchema";
import type { SettingsSchema } from "$data/schema/SettingsSchema";

export const put: RequestHandler = async ({ request }) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let params: SettingsSchema = await request.json();
    if (!await settingsSchema.isValid(params)) {
        return badRequest;
    }

    let user = await session.getUser();
    let settings = await user.getSettings();
    await settings.update(params);
    return ok;
}