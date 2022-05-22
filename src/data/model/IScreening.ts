import type { MovieApiContext } from "../../api/MovieApiContext";
import type { MovieDatabaseContext } from "../../db/MovieDatabaseContext";
import type { ScreeningRoomApiContext } from "../../api/ScreeningRoomApiContext";
import type { ScreeningRoomDatabaseContext } from "../../db/ScreeningRoomDatabaseContext";

export interface IScreening {
    readonly movie: MovieApiContext | MovieDatabaseContext;
    readonly room: ScreeningRoomApiContext | ScreeningRoomDatabaseContext;
    readonly reservedSeats: number[];
    readonly soldOut: boolean;
    readonly start: string | Date;
    readonly seat: number;
}