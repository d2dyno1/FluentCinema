import type {Settings} from "$db/Settings";

export type Session = {
    isLoggedIn: boolean,
    user?: {
        id: string,
        email: string,
        username: string
        settings: Settings
    }
}