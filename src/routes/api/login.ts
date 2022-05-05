import { client } from '$lib/database/db';

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
    } else if (data.email.trim() == "" || data.password.trim() == "") {
        return {
            status: 400,
            body: {
                success: false,
                errorMessage: "Credentials cannot be empty."
            }
        }
    }

    // test query
    let user = await client.query('SELECT * FROM users WHERE id=$1', [data.id]);
    return {
        status: 403
    };
}