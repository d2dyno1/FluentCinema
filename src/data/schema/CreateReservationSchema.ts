import {number, object} from "yup";
import type {InferType} from "yup";

export const createReservationSchema = object({
    screeningId: number().min(0).required(),
    seat: number().min(0).required()
});

export interface CreateReservationSchema extends InferType<typeof createReservationSchema> {}