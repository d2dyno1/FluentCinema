import type { MovieType } from "$data/MovieType";

export type TableDateItem = {
    dayName: string;
    dates?: DateWithType[];
};

export type DateWithType = {
    date: Date;
    type: MovieType;
};