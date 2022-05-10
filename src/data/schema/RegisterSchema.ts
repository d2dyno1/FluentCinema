import {object, string} from "yup";
import type {InferType} from "yup";
import {email, password, usernameValidationRegex} from "../../lib/validation";

export const registerSchema = object({
    username: string().required("A username is required.").matches(usernameValidationRegex, "A username must consist of between 2 and 16 alphanumeric characters, including underscores."),
    email: email,
    password: password
});
export interface RegisterSchema extends InferType<typeof registerSchema> {}