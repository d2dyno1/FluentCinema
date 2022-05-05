import {Client} from 'pg';

export const client = new Client();

client.connect().then(() => console.log("Connected to database."));