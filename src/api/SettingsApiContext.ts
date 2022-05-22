import type { ISettings } from "$data/model/ISettings";

export class SettingsApiContext implements ISettings {
    readonly language: string;
    readonly twoFactorAuthentication: boolean;

    constructor(settings: ISettings) {
        this.language = settings.language;
        this.twoFactorAuthentication = settings.twoFactorAuthentication;
    }

    static async update(settings: ISettings): Promise<void> {
        await fetch("/api/account/settings/update", {
            method: "PUT",
            body: JSON.stringify(settings)
        });
    }
}