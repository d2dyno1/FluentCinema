import type { RequestHandler } from "@sveltejs/kit";
import { MovieController } from "$db/MovieController";

export const get: RequestHandler<any, any> = async ({ params }) => {
    return {
        status: 200,
        body: (await MovieController.getFromId(params.id)).toApiContext()
    }
}