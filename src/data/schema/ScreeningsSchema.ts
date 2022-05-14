import {number, object} from "yup";

export const screeningsSchema = object({
    movieId: number().optional(),
    cinemaId: number().optional()
});