import { client } from "$db";
import type { IDatabaseContext } from "./IDatabaseContext";
import { Screening } from "$api/Screening";
import type { IScreening } from "$data/model/IScreening";
import type { QueryResult } from "pg";
import type { ScreeningType } from "$data/ScreeningType";

const QUERY_SELECT = `
    SELECT screening.*, screening_rooms."seatRowCount", screening_rooms."seatRowLength", (
        SELECT COUNT(seat) FROM reservations
        JOIN screenings ON reservations."screeningId" = screenings.id
        WHERE screenings.id=screening.id
    ) as "reservedSeatCount"
    FROM screenings screening
    JOIN screening_rooms ON screening."roomId" = screening_rooms.id
`;
const QUERY_SELECT_ID = QUERY_SELECT + " WHERE screening.id=$1";
const QUERY_RESERVED_SEATS = `
    SELECT seat as seat FROM reservations
    JOIN screenings ON reservations."screeningId" = screenings.id
    WHERE screenings.id = $1
`;

export class ScreeningController implements IScreening, IDatabaseContext<Screening> {
    readonly soldOut: boolean;
    readonly start!: string | Date;
    readonly seat!: number;
    readonly type!: ScreeningType;

    readonly seatRowCount!: number;
    readonly seatRowLength!: number;
    readonly reservedSeatCount!: number;

    readonly id!: number;
    readonly roomId!: number;
    readonly movieId!: string;
    readonly cinemaId!: string;

    protected constructor(screening: Partial<ScreeningController>) {
        Object.assign(this, screening);
        this.soldOut = this.reservedSeatCount == this.seatRowCount * this.seatRowLength;
    }

    async getReservedSeats(): Promise<number[]> {
        return (await client.query(QUERY_RESERVED_SEATS, [this.id])).rows.map(seat => seat.seat as number);
    }

    public static async getFromId(id: number): Promise<ScreeningController | null> {
        let query: QueryResult<ScreeningController> = await client.query(QUERY_SELECT_ID, [id]);
        if (query.rowCount == 0) {
            return null;
        }
        return new ScreeningController(query.rows[0]);
    }

    static async getAll(cinemaId: string | null, movieId: string | null): Promise<ScreeningController[]> {
        let screenings: ScreeningController[] = (await client.query(QUERY_SELECT)).rows.map(row => new ScreeningController(row));
        if (cinemaId != null) {
            screenings = screenings.filter(screening => screening.cinemaId == cinemaId);
        }
        if (movieId != null) {
            screenings = screenings.filter(screening => screening.movieId == movieId);
        }
        return screenings;
    }

    toApiContext(): Screening {
        return new Screening(this);
    }
}