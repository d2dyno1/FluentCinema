import type { ISettings } from "$data/model/ISettings";
import type { IDatabaseContext } from "./IDatabaseContext";
import { Settings } from "$api/Settings";
import type { SettingsSchema } from "$data/schema/SettingsSchema";
import { client } from "$db";
import type { AccountController } from "./AccountController";

const QUERY_UPDATE_SETTINGS = `
    UPDATE settings
    SET
        language = $1,
        "twoFactorAuthentication" = $2
    WHERE user_id=$3;`;
export class SettingsController implements ISettings, IDatabaseContext<Settings> {


    readonly user_id!: string;

    readonly language!: string;
    readonly twoFactorAuthentication!: boolean;

    private constructor(settings: Partial<SettingsController>) {
        Object.assign(this, settings);
    }

    toApiContext(): Settings {
        return new Settings(this);
    }

    async update(settings: SettingsSchema): Promise<void> {
        await client.query(QUERY_UPDATE_SETTINGS, [settings.language, settings.twoFactorAuthentication, this.user_id]);
    }

    static async create(user: AccountController): Promise<SettingsController> {
        await client.query("INSERT INTO settings(user_id) VALUES($1)", [user.id]);
        return this.getFromUser(user);
    }

    static async getFromUser(user: AccountController): Promise<SettingsController> {
        let query = await client.query("SELECT * FROM settings WHERE user_id=$1;", [user.id]);
        return new SettingsController(query.rows[0]);
    }
}