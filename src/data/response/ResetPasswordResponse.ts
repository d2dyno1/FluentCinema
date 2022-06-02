import type { GeneralResponse } from "./GeneralResponse";

export interface ResetPasswordResponse extends GeneralResponse {
    isTokenValid: boolean;
}