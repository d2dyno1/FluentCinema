import type { IScreening } from "$data/model/IScreening";
import type { MovieApiContext } from "./MovieApiContext";
import type { ScreeningRoomApiContext } from "./ScreeningRoomApiContext";
import type { Fetch } from "./ApiContext";

export class ScreeningApiContext implements IScreening {
    readonly movie: MovieApiContext;
    readonly room: ScreeningRoomApiContext;
    readonly reservedSeats: number[];
    readonly soldOut: boolean;
    readonly start: Date;
    readonly seat: number;

    constructor(screening: IScreening, movie?: MovieApiContext, room?: ScreeningRoomApiContext);
    constructor(screening: IScreening, movie: undefined, room: undefined) {
        this.movie = movie == null ? screening.movie as MovieApiContext : movie;
        this.room = room == null ? screening.room : room;
        this.reservedSeats = screening.reservedSeats
        this.soldOut = screening.soldOut;
        this.start = new Date(screening.start);
        this.seat = screening.seat;
    }

    static async getFromMovieId(fetch: Fetch, movieId: string | number): Promise<ScreeningApiContext[]> {
        return fetch(`/api/cinema/screenings?movieId=${movieId}`).then(response => response.json()).then((screenings: IScreening[]) => {
            return screenings.map(screening => new ScreeningApiContext(screening))
        });
    }
}