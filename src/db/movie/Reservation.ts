import {Screening} from "./Screening";
import type {User} from "$db/User";
import {client} from "$db";
import {ReservationRow} from "$data/db/ReservationRow";

export class Reservation extends ReservationRow {
    private screening: Screening;

    private constructor(row: ReservationRow, screening: Screening) {
        super(row);
        this.screening = screening;
    }

    private static async construct(row: ReservationRow): Promise<Reservation> {
        return (async () => {
            let screening = await Screening.getFromId(row.screeningId) as Screening;
            return new Reservation(row, screening);
        })();
    }

    public static async create(user: User, screeningId: number, seat: number) {
        await client.query('INSERT INTO reservations("userId", "screeningId", seat) VALUES ($1, $2, $3);', [user.id, screeningId, seat]);
    }

    public static async getFromUser(user: User): Promise<Reservation[]> {
        let rows: ReservationRow[] = (await client.query('SELECT * FROM reservations WHERE "userId"=$1;', [user.id])).rows;
        let reservations: Reservation[] = [];
        for (let row of rows) {
            reservations.push(await Reservation.construct(row));
        }
        return reservations;
    }
}