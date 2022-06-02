import { client } from "$db";
import type { IReview } from "$data/model/IReview";
import type { MovieController } from "$db/MovieController";
import type { IDatabaseContext } from "./IDatabaseContext";
import { Review } from "$api/Review";

export class ReviewController implements IReview, IDatabaseContext<Review> {
    readonly userId!: number;
    readonly rating!: number;
    readonly content!: string;
    readonly username!: string;

    readonly id!: number;
    readonly movieId!: number;

    private constructor(review: Partial<ReviewController>) {
        Object.assign(this, review);
    }

    public static async getFromMovie(movie: MovieController): Promise<ReviewController[]> {
        return (await client.query(`
            SELECT reviews.*, users.username FROM reviews 
            JOIN users ON reviews."userId" = users.id 
            WHERE "movieId"=$1;`, [movie.id])).rows.map((row: Partial<ReviewController>) => new ReviewController(row));
    }

    toApiContext() {
        return new Review(this);
    }
}