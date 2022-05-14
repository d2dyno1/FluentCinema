import type {InferType} from "yup";
import {object, string} from "yup";

export const verifyEmailSchema = object({
    token: string().required()
});

export interface VerifyEmailSchema extends InferType<typeof verifyEmailSchema> {}