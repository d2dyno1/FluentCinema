import {string} from "yup";

const emailValidationRegex = /^[a-zA-Z\d]+@[a-zA-Z\d]+.[a-zA-Z\d]+$/;
const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[\d])(?=.*[^a-zA-Z\d]).{8,128}$/;
export const usernameValidationRegex = /^[\w]{2,16}$/;

export const email = string()
    .required("An e-mail is required.")
    .max(100, "E-mail is too long.")
    .matches(emailValidationRegex, "Invalid e-mail.");

export const password = string()
    .required("A password is required.")
    .matches(passwordValidationRegex, "A password must consist of between 8 and 128 characters, including an uppercase letter, a digit and a special character.");