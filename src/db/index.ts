import pkg from 'pg'; // Required due to pg being a CommonJS module, which messes up production build
const { Client } = pkg;
import credentials from "../../credentials.json"

export const client = new Client(credentials.db);
client.connect().then(() => console.log("Connected to database."));