import type { ScreeningType } from "./ScreeningType";

export type TableDateItem = {
    day: number;
    dayName: string;
    dates?: DateWithType[];
};

export type DateWithType = {
    date: Date;
    type: ScreeningType;
};