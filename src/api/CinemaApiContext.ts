import type { ICinema } from "$data/model/ICinema";

export class CinemaApiContext implements ICinema {
    readonly id: number;
    readonly country: string;
    readonly address: string;

    constructor(cinema: ICinema) {
        this.id = cinema.id;
        this.country = cinema.country;
        this.address = cinema.address;
    }
}