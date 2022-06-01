import type { InferType } from "yup";
import { object, string } from "yup";
import { emailSchema, passwordSchema } from "$api/validation";

export const resetPasswordSchema = object({
    email: emailSchema.optional(),
    newPassword: passwordSchema.optional(),
    token: string().optional()
});

export interface ResetPasswordSchema extends InferType<typeof resetPasswordSchema> {}