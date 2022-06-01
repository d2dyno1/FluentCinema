import type { Screening } from "$api/Screening";
import type { TableDateItem } from "$data/table";
import moment from "moment";

export const getScreeningsFormatted: TableDateItem[] = (cinemaId: string, screeningDatesPromise: Promise<any>) => {
    let screeningDates: TableDateItem[] = [];

    screeningDatesPromise.then((data: Screening[]) => {
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
    });

    return screeningDates;
}