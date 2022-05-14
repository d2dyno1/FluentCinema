import type {GeneralResponse} from "./GeneralResponse";

export interface LoginResponse extends GeneralResponse {
    otpRequired?: boolean
}