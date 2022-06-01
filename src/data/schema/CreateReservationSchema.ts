import { number, object, array } from "yup";
import type { InferType } from "yup";

export const createReservationSchema = object({
    screeningId: number().min(0).required(),
    seats: array().of(number().min(0)).min(1).required()
});

export interface CreateReservationSchema extends InferType<typeof createReservationSchema> {}