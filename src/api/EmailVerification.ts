import type { GeneralResponse } from "$data/response/GeneralResponse";
import type { Fetch } from "./ApiContext";

export class EmailVerification {
    static async beginVerification(): Promise<void> {
        await fetch("/api/account/email/beginverification", { method: "POST" });
    }

    /**
     * @return Whether the verification was successful.
     */
    static async verifyEmail(fetch: Fetch, token: string): Promise<boolean> {
        let response = await fetch("/api/account/email/verify", {
            headers: {
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify({ token: token })
        });
        let json = await response.json() as GeneralResponse;
        return json.success;
    }
}