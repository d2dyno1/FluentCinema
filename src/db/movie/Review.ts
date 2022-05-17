import type {User} from "$db/User";
import {client} from "$db";
import type {Movie} from "./Movie";
import {ReviewResponse} from "$data/response/ReviewResponse";
import _ from "underscore";

export class Review extends ReviewResponse {
    public readonly id!: number;
    public readonly userId!: number;
    public readonly movieId!: number;

    private static async construct(queryResult: Partial<Review>): Promise<Review> {
        return (async () => {
            return Object.assign(new Review(), queryResult);
        })();
    }

    public static async create(user: User, movie: Movie, rating: number, content: string) {
        await client.query('INSERT INTO reviews("userId", "movieId", rating, content) VALUES($1, $2, $3, $4)', [user.id, movie.id, rating, content]);
    }

    public static async getFromMovie(movie: Movie): Promise<Review[]> {
        let rows: Partial<Review>[] = (await client.query(`
            SELECT reviews.*, users.username FROM reviews 
            JOIN users ON reviews."userId" = users.id 
            WHERE "movieId"=$1;`, [movie.id])).rows;
        let reviews: Review[] = [];
        for (let row of rows) {
            reviews.push(await Review.construct(row));
        }
        return reviews;
    }

    toJSON() {
        return _.omit(this, ["id", "movieId"]);
    }
}