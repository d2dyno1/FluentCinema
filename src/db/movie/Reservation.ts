import {Screening} from "./Screening";
import type {User} from "$db/User";
import {client} from "$db"
import {ReservationResponse} from "$data/response/ReservationResponse";
import type {ScreeningResponse} from "$data/response/ScreeningResponse";
import _ from "underscore";

export class Reservation extends ReservationResponse {
    private readonly id!: number;
    private readonly userId!: string;
    readonly screeningId!: number;

    private constructor(screening: ScreeningResponse) {
        super(screening);
    }

    private static async construct(queryResult: Partial<Reservation>): Promise<Reservation> {
        return (async () => {
            return Object.assign(new Reservation(await Screening.getFromId(queryResult.screeningId!) as Screening), queryResult);
        })();
    }

    public static async create(user: User, screeningId: number, seat: number) {
        await client.query('INSERT INTO reservations("userId", "screeningId", seat) VALUES ($1, $2, $3);', [user.id, screeningId, seat]);
    }

    public static async getFromUser(user: User): Promise<Reservation[]> {
        let rows: Reservation[] = (await client.query('SELECT * FROM reservations WHERE "userId"=$1;', [user.id])).rows;
        let reservations: Reservation[] = [];
        for (let row of rows) {
            reservations.push(await Reservation.construct(row));
        }
        return reservations;
    }

    toJSON() {
        return _.omit(this, ["id", "userId", "screeningId"]);
    }
}