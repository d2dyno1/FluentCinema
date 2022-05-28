import pkg from 'pg'; // Required due to pg being a CommonJS module, which messes up production build
const { Pool, types } = pkg;
import credentials from "../../credentials.json"
types.setTypeParser(1700, x => parseFloat(x));
export const client = new Pool(credentials.db);
client.connect().then(() => console.log("Connection with database has been established."));