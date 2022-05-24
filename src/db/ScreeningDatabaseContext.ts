import {client} from "$db";
import type {IDatabaseContext} from "./IDatabaseContext";
import {ScreeningApiContext} from "$api/ScreeningApiContext";
import type {IScreening} from "$data/model/IScreening";
import {MovieDatabaseContext} from "./MovieDatabaseContext";
import {ScreeningRoomDatabaseContext} from "./ScreeningRoomDatabaseContext";
import type {QueryResult} from "pg";
import type {ReservationDatabaseContext} from "./ReservationDatabaseContext";
import * as async from "async";
import type { ScreeningType } from "$data/ScreeningType";

const QUERY_RESERVED_SEATS = `
    SELECT seat FROM reservations
    JOIN screenings ON reservations."screeningId" = screenings.id
    WHERE screenings.id=$1;
`

export class ScreeningDatabaseContext implements IScreening, IDatabaseContext<ScreeningApiContext> {
    readonly movie: MovieDatabaseContext;
    readonly room: ScreeningRoomDatabaseContext;
    readonly reservedSeats: number[];
    readonly soldOut: boolean;
    readonly start!: string | Date;
    readonly seat!: number;
    readonly type!: ScreeningType;

    readonly id!: number;
    readonly roomId!: number;
    readonly movieId!: string;
    readonly cinemaId!: string;

    protected constructor(screening: Partial<ScreeningDatabaseContext>, movie: MovieDatabaseContext, room: ScreeningRoomDatabaseContext, reservedSeats: number[], soldOut: boolean) {
        Object.assign(this, screening);
        this.movie = movie;
        this.room = room;
        this.reservedSeats = reservedSeats;
        this.soldOut = soldOut;
    }

    private static async construct(screening: Partial<ScreeningDatabaseContext>): Promise<ScreeningDatabaseContext> {
        return (async () => {
            let movie = await MovieDatabaseContext.getFromId(screening.movieId!);
            let room = (await ScreeningRoomDatabaseContext.getFromId(screening.roomId!))!;
            let reservedSeats: number[] = (await client.query(QUERY_RESERVED_SEATS, [screening.id!])).rows.map((row: Partial<ReservationDatabaseContext>) => row.seat!);
            let soldOut = reservedSeats.length == room.seatRowCount * room.seatRowLength;
            return new ScreeningDatabaseContext(screening, movie, room ,reservedSeats, soldOut);
        })();
    }

    public static async getFromId(id: number): Promise<ScreeningDatabaseContext | null> {
        let query: QueryResult<ScreeningDatabaseContext> = await client.query("SELECT * FROM screenings WHERE id=$1;", [id]);
        if (query.rowCount == 0) {
            return null;
        }
        return ScreeningDatabaseContext.construct(query.rows[0]);
    }

    static async getAll(cinemaId: string | null, movieId: string | null): Promise<ScreeningDatabaseContext[]> {
        let rows: Partial<ScreeningDatabaseContext>[] = (await client.query("SELECT * FROM screenings;")).rows;
        let screenings: ScreeningDatabaseContext[] = [];
        await async.each(rows, async row => {
            screenings.push(await ScreeningDatabaseContext.construct(row));
        })
        if (cinemaId != null) {
            screenings = screenings.filter(screening => screening.cinemaId == cinemaId);
        }
        if (movieId != null) {
            screenings = screenings.filter(screening => screening.movieId == movieId);
        }
        return screenings;
    }

    toApiContext(): ScreeningApiContext {
        return new ScreeningApiContext(this, this.movie.toApiContext(), this.room.toApiContext());
    }
}