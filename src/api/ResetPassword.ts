import type { Fetch } from "./ApiContext";
import type { ResetPasswordResponse } from "$data/response/ResetPasswordResponse";
import type { GeneralResponse } from "$data/response/GeneralResponse";

export class ResetPassword {
    static async beginPasswordResetProcess(fetch: Fetch, email: string): Promise<ResetPasswordResponse> {
        return fetch("/api/account/password/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        }).then(response => response.json());
    }

    static async isTokenValid(fetch: Fetch, token: string): Promise<boolean> {
        return fetch("/api/account/password/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }).then(response => response.json()).then((response: ResetPasswordResponse) => response.isTokenValid);
    }

    static async changePassword(fetch: Fetch, token: string, newPassword: string): Promise<GeneralResponse> {
        return fetch("/api/account/password/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, newPassword })
        }).then(response => response.json());
    }
}