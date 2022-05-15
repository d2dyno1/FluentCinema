import {client} from "$db";
import {Movie} from "$db/movie/Movie";
import type {ScreeningRoom} from "$data/cinema/ScreeningRoom";
import {ScreeningRow} from "$data/db/ScreeningRow";
import type {MovieRow} from "$data/db/MovieRow";

export class Screening extends ScreeningRow {
    public readonly movie: MovieRow;
    public readonly room: ScreeningRoom;
    public readonly takenSeats: number[];
    private readonly soldOut: boolean;

    private constructor(row: ScreeningRow, movie: MovieRow, room: ScreeningRoom, takenSeats: number[], soldOut: boolean) {
        super(row);
        this.movie = movie;
        this.room = room;
        this.takenSeats = takenSeats;
        this.soldOut = soldOut;
    }

    private static async construct(row: ScreeningRow): Promise<Screening> {
        return (async () => {
            let movie = (await Movie.getFromId(row.movieId)).row;
            let room = (await client.query('SELECT * FROM screening_rooms where id=$1;', [row.roomId])).rows[0];
            let takenSeats: number[] = (await client.query('SELECT seat FROM reservations JOIN screenings ON reservations."screeningId" = screenings.id WHERE screenings.id=$1;', [row.id])).rows.map(row => row.seat as number);
            let soldOut = takenSeats.length == room.seatRowCount * room.seatRowLength;

            return new Screening(row, movie, room, takenSeats, soldOut);
        })();
    }

    public static async getFromId(id: number): Promise<Screening | null> {
        let query = await client.query("SELECT * FROM screenings WHERE id=$1;", [id]);
        if (query.rowCount == 0) {
            return null;
        }
        return Screening.construct(query.rows[0] as ScreeningRow);
    }

    public static async getAll(cinemaId: string | null, movieId: string | null): Promise<Screening[]> {
        let rows: ScreeningRow[] = (await client.query("SELECT * FROM screenings;")).rows;
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
}