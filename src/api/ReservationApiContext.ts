import type { ScreeningApiContext } from "./ScreeningApiContext";
import type { IReservation } from "$data/model/IReservation";

export class ReservationApiContext implements IReservation {
    readonly screening: ScreeningApiContext;
    readonly seat: number;

    constructor(reservation: IReservation, screening?: ScreeningApiContext);
    constructor(reservation: IReservation, screening: undefined) {
        this.seat = reservation.seat;
        this.screening = screening == null ? reservation.screening as ScreeningApiContext : screening;
    }

    static async getAll(): Promise<ReservationApiContext[]> {
        let response = await fetch("/api/account/reservation/list");
        let json: ReservationApiContext[] = await response.json();
        return json.map(reservation => new ReservationApiContext(reservation));
    }
}