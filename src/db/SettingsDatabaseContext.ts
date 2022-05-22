import type { ISettings } from "$data/model/ISettings";
import type { IDatabaseContext } from "./IDatabaseContext";
import { SettingsApiContext } from "$api/SettingsApiContext";
import type { SettingsSchema } from "$data/schema/SettingsSchema";
import {client} from "$db";
import type { AccountDatabaseContext } from "./AccountDatabaseContext";

const QUERY_UPDATE_SETTINGS = `
    UPDATE settings
    SET
        language = $1,
        "twoFactorAuthentication" = $2
    WHERE user_id=$3;`;
export class SettingsDatabaseContext implements ISettings, IDatabaseContext<SettingsApiContext> {


    readonly user_id!: string;

    readonly language!: string;
    readonly twoFactorAuthentication!: boolean;

    private constructor(settings: Partial<SettingsDatabaseContext>) {
        Object.assign(this, settings);
    }

    toApiContext(): SettingsApiContext {
        return new SettingsApiContext(this);
    }

    async update(settings: SettingsSchema): Promise<void> {
        await client.query(QUERY_UPDATE_SETTINGS, [settings.language, settings.twoFactorAuthentication, this.user_id]);
    }

    static async create(user: AccountDatabaseContext): Promise<SettingsDatabaseContext> {
        await client.query("INSERT INTO settings(user_id) VALUES($1)", [user.id]);
        return this.getFromUser(user);
    }

    static async getFromUser(user: AccountDatabaseContext): Promise<SettingsDatabaseContext> {
        let query = await client.query("SELECT * FROM settings WHERE user_id=$1;", [user.id]);
        return new SettingsDatabaseContext(query.rows[0]);
    }
}