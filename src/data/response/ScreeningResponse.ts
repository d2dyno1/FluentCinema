import type {MovieResponse} from "./MovieResponse";
import type {ScreeningRoomResponse} from "./ScreeningRoomResponse";

export abstract class ScreeningResponse {
    readonly movie: MovieResponse;
    readonly room: ScreeningRoomResponse;
    readonly takenSeats: number[];
    readonly soldOut: boolean;
    readonly start!: string;
    readonly seat!: number;

    protected constructor(movie: MovieResponse, room: ScreeningRoomResponse, takenSeats: number[], soldOut: boolean) {
        this.movie = movie;
        this.room = room;
        this.takenSeats = takenSeats;
        this.soldOut = soldOut;
    }
}