import type {RequestHandler} from "@sveltejs/kit";
import {addReviewSchema} from "$data/schema/AddReviewSchema";
import type {AddReviewSchema} from "$data/schema/AddReviewSchema";
import {Session} from "$db/Session";
import {forbidden, badRequest} from "$api/responses"
import {Movie} from "$db/movie/Movie";

export const post: RequestHandler = async ({request, params}) => {
    let session = await Session.getFromRequest(request);
    if (session == null) {
        return forbidden;
    }

    let schema: AddReviewSchema = await request.json();
    if (!await addReviewSchema.isValid(schema)) {
        return badRequest;
    }
    await (await Movie.getFromId(params.id)).addReview(await session.getUser(), schema.rating, schema.content);

    return {
        status: 200,
        body: {
            success: true
        }
    }
}