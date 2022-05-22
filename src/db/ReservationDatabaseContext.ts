import type {AccountDatabaseContext} from "./AccountDatabaseContext";
import {client} from "$db"
import {ScreeningDatabaseContext} from "./ScreeningDatabaseContext";
import * as async from "async";
import type {IDatabaseContext} from "./IDatabaseContext";
import {ReservationApiContext} from "../api/ReservationApiContext";
import type {IReservation} from "../data/model/IReservation";

const QUERY_ALL_RESERVATIONS = `
    SELECT * FROM reservations
    JOIN screenings ON reservations."screeningId" = screenings.id
    WHERE "userId"=$1
    ORDER BY screenings.start DESC;
`

export class ReservationDatabaseContext implements IReservation, IDatabaseContext<ReservationApiContext> {
    readonly seat!: number;

    private readonly id!: number;
    private readonly userId!: string;
    readonly screeningId!: number;

    readonly screening: ScreeningDatabaseContext;

    private constructor(reservation: Partial<ReservationDatabaseContext>, screening: ScreeningDatabaseContext) {
        Object.assign(this, reservation);
        this.screening = screening;
    }

    private static async construct(reservation: Partial<ReservationDatabaseContext>): Promise<ReservationDatabaseContext> {
        return (async () => {
            let screening = await ScreeningDatabaseContext.getFromId(reservation.screeningId!);
            return new ReservationDatabaseContext(reservation, screening as ScreeningDatabaseContext);
        })();
    }

    public static async create(user: AccountDatabaseContext, screeningId: number, seat: number) {
        await client.query('INSERT INTO reservations("userId", "screeningId", seat) VALUES ($1, $2, $3);', [user.id, screeningId, seat]);
    }

    public static async getFromUser(user: AccountDatabaseContext): Promise<ReservationDatabaseContext[]> {
        let query: Partial<ReservationDatabaseContext>[] = (await client.query(QUERY_ALL_RESERVATIONS, [user.id])).rows;
        let reservations: ReservationDatabaseContext[] = [];
        await async.each(query, async (reservation: Partial<ReservationDatabaseContext>) => {
            reservations.push(await ReservationDatabaseContext.construct(reservation));
        })
        return reservations;
    }

    toApiContext(): ReservationApiContext {
        return new ReservationApiContext(this, this.screening.toApiContext());
    }
}