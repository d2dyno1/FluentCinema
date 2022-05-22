import type { ScreeningApiContext } from "./ScreeningApiContext";
import type { IReservation } from "$data/model/IReservation";

export class ReservationApiContext implements IReservation {
    readonly screening: ScreeningApiContext;
    readonly seat: number;

    constructor(reservation: IReservation, screening: ScreeningApiContext) {
        this.screening = screening;
        this.seat = reservation.seat;
    }
}