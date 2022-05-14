import type {User} from "../User";
import {client} from "../index";
import type {Movie} from "./Movie";

export class Review {
    private readonly id!: number;
    private readonly userId!: number;
    private readonly movieId!: number;
    private readonly rating!: number;
    private readonly content!: string;

    public static async create(user: User, movie: Movie, rating: number, content: string) {
        await client.query('INSERT INTO reviews("userId", "movieId", rating, content) VALUES($1, $2, $3, $4)', [user.id, movie.id, rating, content]);
    }

    public static async getFromMovie(movie: Movie): Promise<Review[]> {
        let reviews = (await client.query('SELECT * FROM reviews WHERE "movieId"=$1;', [movie.id])).rows;
        return reviews.map(review => Object.assign(new Review(), review));
    }
}