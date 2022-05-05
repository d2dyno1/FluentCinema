import { client } from '$lib/database/db';
import { emailValidationRegex, passwordValidationRegex } from "$lib/auth";

export async function post({ request }) {
    const data = await request.json();

    if (!data.hasOwnProperty("email") || !data.hasOwnProperty("password")) {
        return {
            status: 400,
            body: {
                success: false,
                errorMessage: "Missing credentials."
            }
        }
    } else if (!emailValidationRegex.test(data.email) || !passwordValidationRegex.test(data.password)) {
        return {
            status: 400,
            body: {
                success: false,
                errorMessage: "Invalid credentials."
            }
        }
    }

    return {
        status: 403
    };
}