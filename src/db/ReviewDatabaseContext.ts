import type { AccountDatabaseContext } from "./AccountDatabaseContext";
import { client } from "$db";
import type { IReview } from "$data/model/IReview";
import type { MovieDatabaseContext } from "./MovieDatabaseContext";
import type { IDatabaseContext } from "./IDatabaseContext";
import { ReviewApiContext } from "$api/ReviewApiContext";

export class ReviewDatabaseContext implements IReview, IDatabaseContext<ReviewApiContext> {
    readonly userId!: number;
    readonly rating!: number;
    readonly content!: string;
    readonly username!: string;

    readonly id!: number;
    readonly movieId!: number;

    private constructor(review: Partial<ReviewDatabaseContext>) {
        Object.assign(this, review);
    }

    public static async getFromMovie(movie: MovieDatabaseContext): Promise<ReviewDatabaseContext[]> {
        return (await client.query(`
            SELECT reviews.*, users.username FROM reviews 
            JOIN users ON reviews."userId" = users.id 
            WHERE "movieId"=$1;`, [movie.id])).rows.map((row: Partial<ReviewDatabaseContext>) => new ReviewDatabaseContext(row));
    }

    toApiContext() {
        return new ReviewApiContext(this);
    }
}