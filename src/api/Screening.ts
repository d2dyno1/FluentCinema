import type { IScreening } from "$data/model/IScreening";
import type { Fetch } from "./ApiContext";
import type { ScreeningType } from "$data/ScreeningType";

export class Screening implements IScreening {
    readonly id: string;
    readonly movieId: string;
    readonly cinemaId: string;
    readonly seatRowCount: number;
    readonly seatRowLength: number;
    readonly soldOut: boolean;
    readonly start: string | Date;
    readonly type: ScreeningType;

    constructor(screening: IScreening) {
        this.id = screening.id;
        this.movieId = screening.movieId;
        this.cinemaId = screening.cinemaId;
        this.seatRowCount = screening.seatRowCount;
        this.seatRowLength = screening.seatRowLength;
        this.soldOut = screening.soldOut;
        this.start = new Date(screening.start);
        this.type = screening.type;
    }

    async getReservedSeats(): Promise<number[]> {
        return fetch(`/api/screening/${this.id}/reserved-seats`).then(response => response.json());
    }

    static async getFromId(id: string): Promise<Screening> {
        return fetch(`/api/screening/${id}`).then(response => response.json()).then(screening => new Screening(screening));
    }

    static async getFromMovieId(fetch: Fetch, movieId: string | number): Promise<Screening[]> {
        return fetch(`/api/screening/list?movieId=${movieId}`).then(response => response.json()).then((screenings: IScreening[]) => {
            return screenings.map(screening => new Screening(screening))
        });
    }
}