import pkg from 'pg'; // Required due to pg being a CommonJS module, which messes up production build
const { Pool } = pkg;
import credentials from "../../credentials.json"

export const client = new Pool(credentials.db);
client.connect().then(() => console.log("Connected to database."));