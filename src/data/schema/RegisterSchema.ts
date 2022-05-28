import { object } from "yup";
import type { InferType } from "yup";
import { emailSchema, passwordSchema, usernameSchema } from "$api/validation";

export const registerSchema = object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
});

export interface RegisterSchema extends InferType<typeof registerSchema> {}