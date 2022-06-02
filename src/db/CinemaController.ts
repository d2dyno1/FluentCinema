import type { ICinema } from "$data/model/ICinema";
import type { IDatabaseContext } from "./IDatabaseContext";
import { Cinema } from "$api/Cinema";
import { client } from "$db";

export class CinemaController implements ICinema, IDatabaseContext<Cinema> {
    readonly id!: string;
    readonly city!: string;
    readonly address!: string;
    readonly latitude!: number;
    readonly longitude!: number;

    private constructor(cinema: Partial<CinemaController>) {
        Object.assign(this, cinema);
    }

    toApiContext(): Cinema {
        return new Cinema(this);
    }

    static async getAll(): Promise<CinemaController[]> {
        return (await client.query("SELECT * FROM cinemas;")).rows.map((cinema: Partial<CinemaController>) => new CinemaController(cinema));
    }
}