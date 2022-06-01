import { number, object, array, string } from "yup";
import type { InferType } from "yup";

export const createReservationSchema = object({
    screeningId: string().required(),
    seats: array().of(number().min(0)).min(1).required()
});

export interface CreateReservationSchema extends InferType<typeof createReservationSchema> {}