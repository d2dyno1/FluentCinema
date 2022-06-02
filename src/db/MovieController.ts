import { client } from "$db";
import NodeCache from "node-cache";
import type { IMovie } from "$data/model/IMovie";
import { ReviewController } from "./ReviewController";
import type { IDatabaseContext } from "./IDatabaseContext";
import { Movie } from "$api/Movie";
import * as async from "async";
import type { MovieType } from "$data/MovieType";

interface MovieImages {
    banner: Uint8Array,
    poster: Uint8Array
}

const imageCache = new NodeCache({ stdTTL: 0 });

const QUERY_ALL_MOVIES = `
    SELECT name, description, "descriptionExtended", id, length, release, type, price, (
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

export class MovieController implements IMovie, IDatabaseContext<Movie> {
    readonly description!: string;
    readonly descriptionExtended!: string;
    readonly id!: number;
    readonly length!: number;
    readonly name!: string;
    readonly rating!: number;
    readonly release!: Date;
    readonly type!: MovieType;
    readonly price!: number;

    readonly bannerImage: Uint8Array;
    readonly posterImage: Uint8Array;

    private constructor(movie: Partial<MovieController>, images: MovieImages) {
        Object.assign(this, movie);
        this.bannerImage = images.banner;
        this.posterImage = images.poster;
    }

    private static async construct(queryResult: Partial<MovieController>): Promise<MovieController> {
        return (async () => {
            let id = queryResult.id!;
            let images: MovieImages;
            if (imageCache.has(id)) {
                images = imageCache.get(id) as MovieImages;
            } else {
                images = (await client.query(QUERY_MOVIE_IMAGES, [id])).rows[0] as MovieImages;
                imageCache.set(id, images);
            }
            return new MovieController(queryResult, images);
        })();
    }

    async getReviews() {
        return await ReviewController.getFromMovie(this);
    }

    static async getAll(): Promise<MovieController[]> {
        let rows: Partial<MovieController>[] = (await client.query(QUERY_ALL_MOVIES)).rows
        let movies: MovieController[] = [];
        await async.each(rows, async movie => {
            movies.push(await MovieController.construct(movie));
        })
        return movies;
    }

    static async getFromId(id: number | string): Promise<MovieController | null> {
        let query = await client.query(QUERY_MOVIE_BY_ID, [id]);
        if (query.rowCount == 0) {
            return null;
        }
        return MovieController.construct(query.rows[0]);
    }

    toApiContext(): Movie {
        return new Movie(this);
    }
}