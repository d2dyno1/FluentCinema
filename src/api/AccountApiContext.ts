import type { LoginSchema } from "$data/schema/LoginSchema";
import type { LoginResponse } from "$data/response/LoginResponse";
import type { RegisterSchema } from "$data/schema/RegisterSchema";
import type { GeneralResponse } from "$data/response/GeneralResponse";

export class AccountApiContext {
    static async uploadProfilePicture(file: File): Promise<void> {
        if (file == null) {
            await fetch("/api/account/picture/upload", { method: "DELETE" });
        } else {
            await fetch("/api/account/picture/upload", {
                method: "PUT",
                body: file
            });
        }
    }

    /**
     * @return {Promise<string>} A base64-encoded string containing the picture data, or null if the user has the default picture.
     */
    static async getProfilePicture(id: string): Promise<string | null> {
        let resolvePromise: (value: (string | PromiseLike<string | null>)) => void;
        let promise: Promise<string | null> = new Promise((resolve, reject) => resolvePromise = resolve);
        let response = await fetch(`/api/account/${id}/picture`);
        if (response.headers.get("content-type")!.startsWith("image/")) {
            let buffer = await response.arrayBuffer();
            let reader = new FileReader();
            reader.onload = (event) => {
                resolvePromise((event.target!.result as string).split(",")[1]);
            }
            reader.readAsDataURL(new Blob([buffer]));
        } else {
            // @ts-ignore
            resolvePromise(null);
        }
        return promise;
    }

    static async delete(): Promise<void> {
        await fetch("/api/account/delete", { method: "DELETE"});
    }

    static async logout(): Promise<void> {
        await fetch("/api/account/logout", { method: "POST" })
    }

    static async login(schema: LoginSchema): Promise<LoginResponse> {
        let response: LoginResponse = await fetch("/api/account/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(schema)
        }).then(response => response.json());
        if (!response.success) {
            throw response.message;
        }
        return response;
    }

    static async register(schema: RegisterSchema): Promise<GeneralResponse> {
        let response: GeneralResponse = await fetch("/api/account/register", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(schema)
        }).then(response => response.json());
        if (!response.success) {
            throw response.message;
        }
        return response;
    }
}