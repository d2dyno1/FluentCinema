import type {User} from "$db/User";
import {client} from "$db";
import type {Movie} from "./Movie";
import {ReviewRow} from "$data/db/ReviewRow";

export class Review extends ReviewRow {
    public readonly username!: string;

    constructor(row: ReviewRow, username: string) {
        super(row);
        this.username = username;
    }

    private static async construct(row: ReviewRow, username: string): Promise<Review> {
        return (async () => {
            return new Review(row, username);
        })();
    }

    public static async create(user: User, movie: Movie, rating: number, content: string) {
        await client.query('INSERT INTO reviews("userId", "movieId", rating, content) VALUES($1, $2, $3, $4)', [user.id, movie.id, rating, content]);
    }

    public static async getFromMovie(movie: Movie): Promise<Review[]> {
        let rows = (await client.query('SELECT reviews.*, users.username FROM reviews JOIN users ON reviews."userId" = users.id WHERE "movieId"=$1;', [movie.id])).rows;
        let reviews: Review[] = [];
        for (let row of rows) {
            reviews.push(await Review.construct(row as ReviewRow, row.username));
        }
        return reviews;
    }
}