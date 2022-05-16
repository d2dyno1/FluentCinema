import {client} from "$db";
import type {User} from "$db/User";
import {Review} from "./Review";
import NodeCache from "node-cache";
import {MovieRow} from "$data/db/MovieRow";
import _ from "underscore";

interface MovieImages {
    banner: Uint8Array,
    poster: Uint8Array
}

const imageCache = new NodeCache({ stdTTL: 0 });

export class Movie extends MovieRow {
    public readonly bannerImage: Uint8Array;
    public readonly posterImage: Uint8Array;
    public readonly rating: number;

    constructor(row: MovieRow, rating: number, images: MovieImages) {
        super(row)
        this.rating = rating;
        this.bannerImage = images.banner;
        this.posterImage = images.poster;
    }

    private static async construct(row: MovieRow): Promise<Movie> {
        return (async () => {
            let rating = (await client.query(`SELECT ROUND(AVG(reviews.rating), 1) as rating FROM reviews JOIN movies ON reviews."movieId" = movies.id WHERE movies.id=$1;`, [row.id])).rows[0].rating;
            if (rating == null) {
                rating = 0;
            }
            if (imageCache.has(row.id)) {
                return new Movie(row, rating, imageCache.get(row.id));
            }
            let images = (await client.query('SELECT "bannerImage" as banner, "posterImage" as poster FROM movies WHERE id=$1', [row.id])).rows[0] as MovieImages;
            imageCache.set(row.id, images);
            return new Movie(row, rating, images);
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

    public static async getFromId(id: string): Promise<Movie> {
        let movie = (await client.query('SELECT id, name, description, "descriptionExtended", length, release FROM movies WHERE id=$1;', [id])).rows[0];
        return await Movie.construct(movie);
    }

    toJSON() {
        return _.omit(this, ["bannerImage", "posterImage"]);
    }
}