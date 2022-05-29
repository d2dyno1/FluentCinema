import type { ScreeningType } from "$data/ScreeningType";

export interface IScreening {
    readonly movieId: string;
    readonly cinemaId: string;
    readonly seatRowCount: number;
    readonly seatRowLength: number;
    readonly soldOut: boolean;
    readonly start: string | Date;
    readonly type: ScreeningType;
}