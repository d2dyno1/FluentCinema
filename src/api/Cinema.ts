import type { ICinema } from "$data/model/ICinema";

export class Cinema implements ICinema {
    readonly id: number;
    readonly city: string;
    readonly address: string;

    constructor(cinema: ICinema) {
        this.id = cinema.id;
        this.city = cinema.city;
        this.address = cinema.address;
    }
}