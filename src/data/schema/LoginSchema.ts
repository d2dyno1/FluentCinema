import {object} from "yup";
import type {InferType} from "yup";
import {email, otp, password} from "$api/validation";

export const loginSchema = object({
    email: email,
    password: password,
    otp: otp
});

export interface LoginSchema extends InferType<typeof loginSchema> {}