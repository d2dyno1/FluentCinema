import type { ISettings } from "./model/ISettings";

export type AccountSession = {
    isLoggedIn: boolean,
    user?: {
        id: string,
        email: string,
        username: string
        settings: ISettings,
        isVerified: boolean
    }
}