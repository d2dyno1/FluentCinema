import {client} from "$db";
import {Movie} from "$db/movie/Movie";
import {ScreeningResponse} from "$data/response/ScreeningResponse";
import type {MovieResponse} from "$data/response/MovieResponse";
import _ from "underscore";
import type {Reservation} from "./Reservation";
import type {ScreeningRoomResponse} from "$data/response/ScreeningRoomResponse";
import {ScreeningRoom} from "./ScreeningRoom";

export class Screening extends ScreeningResponse {
    public readonly id!: number;
    public readonly roomId!: number;
    public readonly movieId!: string;
    public readonly cinemaId!: string;

    private constructor(movie: MovieResponse, room: ScreeningRoomResponse, takenSeats: number[], soldOut: boolean) {
        super(movie, room, takenSeats, soldOut);
    }

    private static async construct(queryResult: Partial<Screening>): Promise<Screening> {
        return (async () => {
            let movie = await Movie.getFromId(queryResult.movieId!);
            let room = (await ScreeningRoom.getFromId(queryResult.roomId!))!;
            let takenSeats: number[] = (await client.query(`
                SELECT seat FROM reservations
                JOIN screenings ON reservations."screeningId" = screenings.id
                WHERE screenings.id=$1;`, [queryResult.id!])).rows.map((row: Partial<Reservation>) => row.seat!);
            let soldOut = takenSeats.length == room.seatRowCount * room.seatRowLength;
            return Object.assign(new Screening(movie, room, takenSeats, soldOut), queryResult);
        })();
    }

    public static async getFromId(id: number): Promise<Screening | null> {
        let query = await client.query("SELECT * FROM screenings WHERE id=$1;", [id]);
        if (query.rowCount == 0) {
            return null;
        }
        return Screening.construct(query.rows[0]);
    }

    public static async getAll(cinemaId: string | null, movieId: string | null): Promise<Screening[]> {
        let rows: Partial<Screening>[] = (await client.query("SELECT * FROM screenings;")).rows;
        let screenings: Screening[] = [];
        for (let row of rows) {
            screenings.push(await Screening.construct(row));
        }
        if (cinemaId != null) {
            screenings = screenings.filter(screening => screening.cinemaId == cinemaId);
        }
        if (movieId != null) {
            screenings = screenings.filter(screening => screening.movieId == movieId);
        }
        return screenings;
    }

    toJSON() {
        return _.omit(this, ['id', "roomId", "movieId", "cinemaId"]);
    }
}