import {boolean, object, string} from "yup";
import type {InferType} from "yup";

export const settingsSchema = object({
    language: string().required().test(s => s == "en_US" || s == "pl_PL"),
    twoFactorAuthentication: boolean().required()
});
export interface SettingsSchema extends InferType<typeof settingsSchema> {}