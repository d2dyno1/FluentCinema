import type { AccountController } from "./AccountController";
import { client } from "$db"
import type { IDatabaseContext } from "./IDatabaseContext";
import { Reservation } from "$api/Reservation";
import type { IReservation } from "$data/model/IReservation";

const QUERY_ALL_RESERVATIONS = `
    SELECT 
        movies.id as "movieId",
        seat, screenings.start as date ,
        movies.name as "movieName"
    FROM reservations
    JOIN screenings ON reservations."screeningId" = screenings.id
    JOIN movies ON screenings."movieId" = movies.id
    WHERE "userId"=$1
    ORDER BY screenings.start DESC;
`

export class ReservationController implements IReservation, IDatabaseContext<Reservation> {
    readonly seat!: number;
    readonly date!: Date;
    readonly movieName!: string;
    readonly movieId!: number;

    private constructor(reservation: Partial<ReservationController>) {
        Object.assign(this, reservation);
    }

    public static async create(user: AccountController, screeningId: string, seat: number) {
        await client.query('INSERT INTO reservations("userId", "screeningId", seat) VALUES ($1, $2, $3);', [user.id, screeningId, seat]);
    }

    public static async getFromUser(user: AccountController): Promise<ReservationController[]> {
        let query: Partial<ReservationController>[] = (await client.query(QUERY_ALL_RESERVATIONS, [user.id])).rows;
        return query.map(row => new ReservationController(row));
    }

    toApiContext(): Reservation {
        return new Reservation(this);
    }

    static async deleteExpiredEntries(): Promise<void> {
        await client.query('DELETE FROM reservations WHERE id IN (SELECT reservations.id FROM reservations LEFT JOIN screenings ON reservations."screeningId" = screenings.id WHERE screenings.id IS NULL);');
    }
}

setInterval(async () => {
    await ReservationController.deleteExpiredEntries();
}, 600000);