import type {InferType} from "yup";
import {object} from "yup";
import {email} from "../../api/validation";

export const resetPasswordSchema = object({
    email: email
});

export interface ResetPasswordSchema extends InferType<typeof resetPasswordSchema> {}