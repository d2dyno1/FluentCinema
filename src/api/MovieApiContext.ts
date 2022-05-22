import type { IMovie } from "$data/model/IMovie";
import type { Fetch } from "./ApiContext";
import { ReviewApiContext } from "./ReviewApiContext";
import { ScreeningApiContext } from "./ScreeningApiContext";

export class MovieApiContext implements IMovie {
    readonly description: string;
    readonly descriptionExtended: string;
    readonly id: number;
    readonly length: number;
    readonly name: string;
    readonly rating: number;
    readonly release: string | Date;

    constructor(movie: IMovie) {
        this.description = movie.description;
        this.descriptionExtended = movie.descriptionExtended;
        this.id = movie.id;
        this.length = movie.length;
        this.name = movie.name;
        this.rating = movie.rating;
        this.release = new Date(movie.release);
    }

    async getReviews(fetch: Fetch) {
        return ReviewApiContext.getFromMovieId(fetch, this.id);
    }

    async getScreenings(fetch: Fetch) {
        return ScreeningApiContext.getFromMovieId(fetch, this.id);
    }

    static async getAll(fetch: Fetch): Promise<MovieApiContext[]> {
        return fetch("/api/cinema/movie/list").then(response => response.json()).then((movies: IMovie[]) => {
            return movies.map((movie) => new MovieApiContext(movie))
        });
    }

    static async getFromId(fetch: Fetch, id: string | number): Promise<MovieApiContext | null> {
        return fetch(`/api/cinema/movie/${id}`).then(response => response.json()).then((movie: IMovie) => new MovieApiContext(movie));
    }
}