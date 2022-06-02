import type { IMovie } from "$data/model/IMovie";
import type { Fetch } from "./ApiContext";
import { Review } from "./Review";
import { Screening } from "./Screening";
import type { MovieType } from "$data/MovieType";

export class Movie implements IMovie {
    readonly description: string;
    readonly descriptionExtended: string;
    readonly id: number;
    readonly length: number;
    readonly name: string;
    readonly rating: number;
    readonly release: string | Date;
    readonly type: MovieType;
    readonly price: number;

    constructor(movie: IMovie) {
        this.description = movie.description;
        this.descriptionExtended = movie.descriptionExtended;
        this.id = movie.id;
        this.length = movie.length;
        this.name = movie.name;
        this.rating = movie.rating;
        this.release = new Date(movie.release);
        this.type = movie.type;
        this.price = movie.price;
    }

    async getReviews(fetch: Fetch) {
        return Review.getFromMovieId(fetch, this.id);
    }

    async getScreenings(fetch: Fetch) {
        return Screening.getFromMovieId(fetch, this.id);
    }

    static async getList(fetch: Fetch): Promise<Movie[]> {
        return fetch("/api/movie/list").then(response => response.json()).then((movies: IMovie[]) => {
            return movies.map((movie) => new Movie(movie))
        });
    }

    static async getFromId(fetch: Fetch, id: string | number): Promise<Movie | null> {
        let movie: IMovie = await fetch(`/api/movie/${id}`).then(response => response.json())
        if (movie.id == null) {
            return null;
        }
        return new Movie(movie);
    }
}