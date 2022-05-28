import type { ScreeningType } from "./ScreeningType";

export type TableDateItem = {
    dayName: string;
    dates?: DateWithType[];
};

export type DateWithType = {
    date: Date;
    type: ScreeningType;
};