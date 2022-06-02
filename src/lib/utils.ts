import type { Screening } from "$api/Screening";
import type { TableDateItem } from "$data/table";
import { ScreeningType } from "$data/ScreeningType";
import moment from "moment";

export const getScreeningsFormatted = (cinemaId: string, data: Screening[]): TableDateItem[] => {
    let screeningDates: TableDateItem[] = [];

    // Fill the table
    for (let i = 0; i < 7 /* Week days */; i++)
    {
        let now = moment().add(i, 'day');
        screeningDates.push({ day: now.day(), dayName: now.format('dddd') });
    }
    // Fill screenings
    data.forEach(x => {
        if (x.cinemaId != cinemaId) {
            return;
        }
        let startDate = x.start as Date;
        let day = startDate.getDay() - 1;
        if (day < 0) {
            day = 6;
        }
        screeningDates[day].dates ??= [];
        screeningDates[day].dates?.push({ date: startDate, type: x.type });
    });

    return screeningDates;
}

export const getFriendlyScreeningTypeName = (movieType?: ScreeningType): string => {
    switch (movieType?.toString())
    {
        case ScreeningType.SUBTITLES_2D: return "Sub 2D";
        case ScreeningType.SUBTITLES_3D: return "Sub 3D";

        case ScreeningType.DUBBING_2D: return "Dub 2D";
        case ScreeningType.DUBBING_3D: return "Dub 3D";

        default: return "";
    };
}