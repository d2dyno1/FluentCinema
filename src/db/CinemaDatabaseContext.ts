import type { ICinema } from "$data/model/ICinema";
import type { IDatabaseContext } from "./IDatabaseContext";
import { CinemaApiContext } from "$api/CinemaApiContext";
import {client} from "./index";

export class CinemaDatabaseContext implements ICinema, IDatabaseContext<CinemaApiContext> {
    readonly id!: number;
    readonly address!: string;
    readonly country!: string;

    private constructor(cinema: Partial<CinemaDatabaseContext>) {
        Object.assign(this, cinema);
    }

    toApiContext(): CinemaApiContext {
        return new CinemaApiContext(this);
    }

    static async getAll(): Promise<CinemaDatabaseContext[]> {
        return (await client.query("SELECT * FROM cinemas;")).rows.map((cinema: Partial<CinemaDatabaseContext>) => new CinemaDatabaseContext(cinema));
    }
}