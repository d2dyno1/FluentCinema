import type {User} from "./User";
import {client} from ".";
import type {SettingsSchema} from "../data/schema/SettingsSchema";

export class Settings {
    private readonly user_id!: string;
    public readonly language!: string;
    public readonly twoFactorAuthentication!: string;

    public async update(settings: SettingsSchema) {
        await client.query("UPDATE settings SET language=$1, \"twoFactorAuthentication\"=$2 WHERE user_id=$3;", [settings.language, settings.twoFactorAuthentication, this.user_id]);
    }

    public static async create(user: User) {
        await client.query("INSERT INTO settings(user_id) VALUES($1);", [user.id]);
        return await Settings.getFromUser(user);
    }

    public static async getFromUser(user: User): Promise<Settings> {
        let query = await client.query("SELECT * FROM settings WHERE user_id=$1;", [user.id]);
        return Object.assign(new Settings(), query.rows[0]);
    }
}