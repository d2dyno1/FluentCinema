import {object} from "yup";
import type {InferType} from "yup";
import {email, password} from "../../lib/validation";

export const loginSchema = object({
    email: email,
    password: password
});
export interface LoginSchema extends InferType<typeof loginSchema> {}