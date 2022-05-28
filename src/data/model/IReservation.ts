import type { ScreeningApiContext } from "../../api/ScreeningApiContext";
import type { ScreeningDatabaseContext } from "../../db/ScreeningDatabaseContext";

export interface IReservation {
    readonly screening: ScreeningApiContext | ScreeningDatabaseContext;
    readonly seat: number;
}