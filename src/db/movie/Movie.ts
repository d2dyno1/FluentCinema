import {client} from "../index";
import type {User} from "../User";
import {Review} from "./Review";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

export class Movie {
    readonly id!: number;
    readonly name!: string; // Name of the movie
    readonly description!: string; // Description (episode, chapter)
    readonly descriptionExtended!: string; // Description of the movie
    private readonly rating!: number; // Rating 1-5
    readonly bannerImage!: Uint8Array; // Movie banner
    readonly posterImage!: Uint8Array;
    readonly length!: number;
    readonly release!: string;

    public async addReview(user: User, rating: number, content: string) {
        await Review.create(user, this, rating, content);
    }

    public async getReviews() {
        return await Review.getFromMovie(this);
    }

    public static async getAll(): Promise<Movie[]> {
        return (await client.query('SELECT name, description, "descriptionExtended", rating, id, length, release FROM movies;')).rows;
    }

    public static async getFromId(id: number): Promise<Movie> {
        if (cache.has(id)) {
            return cache.get(id) as Movie;
        }
        let query = (await client.query("SELECT * FROM movies WHERE id=$1;", [id])).rows[0];
        let movie = Object.assign(new Movie(), query);
        cache.set(id, movie);
        return movie;
    }
}