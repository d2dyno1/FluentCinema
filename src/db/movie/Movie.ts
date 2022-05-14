import {client} from "../index";
import type {User} from "../User";
import {Review} from "./Review";

export class Movie {
    readonly id!: number;
    readonly name!: string; // Name of the movie
    readonly description!: string; // Description (episode, chapter)
    readonly descriptionExtended!: string; // Description of the movie
    private readonly rating!: number; // Rating 1-5
    readonly bannerImage!: string; // Movie banner
    readonly posterImage!: string; // Movie poster,
    readonly length!: number;
    readonly release!: string;

    public async addReview(user: User, rating: number, content: string) {
        await Review.create(user, this, rating, content);
    }

    public async getReviews() {
        return await Review.getFromMovie(this);
    }

    public static async getAll(): Promise<Movie[]> {
        let movies = (await client.query("SELECT * FROM movies;")).rows;
        return movies.map(movie => Object.assign(new Movie(), movie));
    }

    public static async getFromId(id: number): Promise<Movie> {
        let movie = (await client.query("SELECT * FROM movies WHERE id=$1;", [id])).rows[0];
        return Object.assign(new Movie(), movie);
    }
}