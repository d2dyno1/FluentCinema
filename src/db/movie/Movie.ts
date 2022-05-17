import {client} from "$db";
import type {User} from "$db/User";
import {Review} from "./Review";
import NodeCache from "node-cache";
import _ from "underscore";
import {MovieResponse} from "$data/response/MovieResponse";

interface MovieImages {
    banner: Uint8Array,
    poster: Uint8Array
}

const imageCache = new NodeCache({ stdTTL: 0 });

export class Movie extends MovieResponse {
    readonly bannerImage: Uint8Array;
    readonly posterImage: Uint8Array;

    constructor(rating: number, images: MovieImages) {
        super(rating);
        this.bannerImage = images.banner;
        this.posterImage = images.poster;
    }

    private static async construct(queryResult: Partial<Movie>): Promise<Movie> {
        return (async () => {
            let id = queryResult.id!;
            let rating = (await client.query(`
                SELECT ROUND(AVG(reviews.rating), 1) as rating 
                FROM reviews
                JOIN movies ON reviews."movieId" = movies.id
                WHERE movies.id=$1;`, [id])).rows[0].rating;
            if (rating == null) {
                rating = 0;
            }
            let images: MovieImages;
            if (imageCache.has(id)) {
                images = imageCache.get(id) as MovieImages;
            } else {
                images = (await client.query(`
                    SELECT "bannerImage" as banner, "posterImage" as poster 
                    FROM movies
                    WHERE id=$1`, [id])).rows[0] as MovieImages;
                imageCache.set(id, images);
            }
            return Object.assign(new Movie(rating, images), queryResult);
        })();
    }

    public async addReview(user: User, rating: number, content: string) {
        await Review.create(user, this, rating, content);
    }

    public async getReviews() {
        return await Review.getFromMovie(this);
    }

    public static async getAll(): Promise<Movie[]> {
        let rows = (await client.query('SELECT name, description, "descriptionExtended", id, length, release FROM movies ORDER BY id;')).rows
        let movies: Movie[] = [];
        for (let row of rows) {
            movies.push(await Movie.construct(row));
        }
        return movies;
    }

    public static async getFromId(id: number | string): Promise<Movie> {
        let movie = (await client.query('SELECT id, name, description, "descriptionExtended", length, release FROM movies WHERE id=$1;', [id])).rows[0];
        return await Movie.construct(movie);
    }

    toJSON() {
        return _.omit(this, ["bannerImage", "posterImage"]);
    }
}