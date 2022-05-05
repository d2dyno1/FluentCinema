import { client } from '$lib/database/db';

export async function post({ request }) {
    const data = await request.json();

    // test query
    let user = await client.query('SELECT * FROM users WHERE id=$1', [data.id]);
    return {
        status: 403
    };
}