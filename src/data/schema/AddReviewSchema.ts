import {number, object, string} from "yup";
import type {InferType} from "yup";

export const addReviewSchema = object({
    rating: number().min(0).max(5).required(),
    content: string().min(100).max(500).required()
});

export interface AddReviewSchema extends InferType<typeof addReviewSchema> {}