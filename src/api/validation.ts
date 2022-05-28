import {string} from "yup";

export const emailSchema = string()
    .required("An e-mail is required.")
    .max(100, "E-mail is too long.")
    .matches(/^[a-zA-Z\d]+@[a-zA-Z\d]+\.[a-zA-Z\d]+$/, "Invalid e-mail.");

export const passwordSchema = string()
    .required("A password is required.")
    .matches(/^(?=.*[A-Z])(?=.*[\d])(?=.*[^a-zA-Z\d]).{8,128}$/, "A password must consist of between 8 and 128 characters, including an uppercase letter, a digit and a special character.");

export const otpSchema = string()
    .optional()
    .matches(/^\d{6}$/, "Invalid one-time password.")

export const usernameSchema = string()
    .required("A username is required.")
    .min(2, "Username is too short.")
    .max(16, "Username is too long.")
    .matches(/^\w+$/, "Username contains invalid characters.")