import type { MovieType } from "$data/MovieType";

export interface IMovie {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly descriptionExtended: string;
    readonly length: number;
    readonly release: string | Date;
    readonly rating: number;
    readonly type: MovieType;
    readonly price: number;
}