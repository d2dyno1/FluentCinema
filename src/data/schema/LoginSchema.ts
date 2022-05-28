import { object } from "yup";
import type { InferType } from "yup";
import { emailSchema, otpSchema, passwordSchema } from "$api/validation";

export const loginSchema = object({
    email: emailSchema,
    password: passwordSchema,
    otp: otpSchema
});

export interface LoginSchema extends InferType<typeof loginSchema> {}