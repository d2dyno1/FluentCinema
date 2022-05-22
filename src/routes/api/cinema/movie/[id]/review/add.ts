import type { RequestHandler } from "@sveltejs/kit";
import { addReviewSchema } from "$data/schema/AddReviewSchema";
import type { AddReviewSchema } from "$data/schema/AddReviewSchema";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { forbidden, badRequest } from "$api/responses"
import { MovieDatabaseContext } from "$db/MovieDatabaseContext";

export const post: RequestHandler = async ({request, params}) => {
    let session = await SessionDatabaseContext.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let schema: AddReviewSchema = await request.json();
    if (!await addReviewSchema.isValid(schema)) {
        return badRequest;
    }
    await (await MovieDatabaseContext.getFromId(params.id)).addReview(await session.getUser(), schema.rating, schema.content);

    return {
        status: 200,
        body: {
            success: true
        }
    }
}