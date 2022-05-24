import {client} from "$db";
import type {AccountDatabaseContext} from "./AccountDatabaseContext";
import NodeCache from "node-cache";
import type {IMovie} from "../data/model/IMovie";
import {ReviewDatabaseContext} from "./ReviewDatabaseContext";
import type {IDatabaseContext} from "./IDatabaseContext";
import {MovieApiContext} from "../api/MovieApiContext";
import * as async from "async";
import type { MovieType } from "$data/MovieType";

interface MovieImages {
    banner: Uint8Array,
    poster: Uint8Array
}

const imageCache = new NodeCache({ stdTTL: 0 });

const QUERY_ALL_MOVIES = `
    SELECT name, description, "descriptionExtended", id, length, release, type, (
        SELECT coalesce(ROUND(AVG(reviews.rating), 1), 0) 
        FROM reviews
        JOIN movies ON reviews."movieId" = movies.id 
        WHERE movies.id = movie.id                         
    ) as rating
    FROM movies movie`;
const QUERY_MOVIE_BY_ID = QUERY_ALL_MOVIES + " WHERE movie.id = $1";
const QUERY_MOVIE_IMAGES = `
    SELECT "bannerImage" as banner, "posterImage" as poster 
    FROM movies
    WHERE id=$1;
`

export class MovieDatabaseContext implements IMovie, IDatabaseContext<MovieApiContext> {
    readonly description!: string;
    readonly descriptionExtended!: string;
    readonly id!: number;
    readonly length!: number;
    readonly name!: string;
    readonly rating!: number;
    readonly release!: Date;
    readonly type!: MovieType;

    readonly bannerImage: Uint8Array;
    readonly posterImage: Uint8Array;

    private constructor(movie: Partial<MovieDatabaseContext>, images: MovieImages) {
        Object.assign(this, movie);
        this.bannerImage = images.banner;
        this.posterImage = images.poster;
    }

    private static async construct(queryResult: Partial<MovieDatabaseContext>): Promise<MovieDatabaseContext> {
        return (async () => {
            let id = queryResult.id!;
            let images: MovieImages;
            if (imageCache.has(id)) {
                images = imageCache.get(id) as MovieImages;
            } else {
                images = (await client.query(QUERY_MOVIE_IMAGES, [id])).rows[0] as MovieImages;
                imageCache.set(id, images);
            }
            return new MovieDatabaseContext(queryResult, images);
        })();
    }

    async addReview(user: AccountDatabaseContext, rating: number, content: string) {
        await ReviewDatabaseContext.create(user, this, rating, content);
    }

    async getReviews() {
        return await ReviewDatabaseContext.getFromMovie(this);
    }

    static async getAll(): Promise<MovieDatabaseContext[]> {
        let rows: Partial<MovieDatabaseContext>[] = (await client.query(QUERY_ALL_MOVIES)).rows
        let movies: MovieDatabaseContext[] = [];
        await async.each(rows, async movie => {
            movies.push(await MovieDatabaseContext.construct(movie));
        })
        return movies;
    }

    static async getFromId(id: number | string): Promise<MovieDatabaseContext> {
        let movie = (await client.query(QUERY_MOVIE_BY_ID, [id])).rows[0];
        return MovieDatabaseContext.construct(movie);
    }

    toApiContext(): MovieApiContext {
        return new MovieApiContext(this);
    }
}