import type { IReservation } from "$data/model/IReservation";

export class Reservation implements IReservation {
    readonly seat: number;
    readonly date: Date;
    readonly movieName: string;
    readonly movieId: number;

    constructor(reservation: IReservation) {
        this.seat = reservation.seat;
        this.date = new Date(reservation.date);
        this.movieName = reservation.movieName;
        this.movieId = reservation.movieId
    }

    static async getAll(): Promise<Reservation[]> {
        let response = await fetch("/api/account/reservation/list");
        let json: Reservation[] = await response.json();
        return json.map(reservation => new Reservation(reservation));
    }
}