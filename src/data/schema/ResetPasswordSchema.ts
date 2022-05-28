import type { InferType } from "yup";
import { object } from "yup";
import { emailSchema } from "$api/validation";

export const resetPasswordSchema = object({
    email: emailSchema
});

export interface ResetPasswordSchema extends InferType<typeof resetPasswordSchema> {}