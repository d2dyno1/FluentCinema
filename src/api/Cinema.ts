import type { ICinema } from "$data/model/ICinema";
import type { Fetch } from "$api/ApiContext";

export class Cinema implements ICinema {
    readonly id: number;
    readonly city: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;

    constructor(cinema: ICinema) {
        this.id = cinema.id;
        this.city = cinema.city;
        this.address = cinema.address;
        this.latitude = cinema.latitude;
        this.longitude = cinema.longitude;
    }

    static async getList(fetch: Fetch): Promise<Cinema[]> {
        return fetch("/api/cinema/list").then(response => response.json()).then((cinemas: ICinema[]) => {
            return cinemas.map(cinema => new Cinema(cinema))
        });
    }
}