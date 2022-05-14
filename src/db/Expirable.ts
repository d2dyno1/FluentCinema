import moment from "moment";
import {client} from ".";

export abstract class Expirable {
    public readonly expires_at?: Date;

    public isExpired() {
        return moment().isAfter(moment(this.expires_at));
    }

    public abstract invalidate(): Promise<void>;
}

export function initializeExpiredEntryDeleter(createInstance: () => object, databaseName: string) {
    setInterval(async () => {
        let query = await client.query(`SELECT * FROM ${databaseName};`);
        let tokens: Expirable[] = query.rows.map(row => Object.assign(createInstance(), row));
        for (let token of tokens) {
            if (token.isExpired()) {
                await token.invalidate();
            }
        }
    }, 10000);
}