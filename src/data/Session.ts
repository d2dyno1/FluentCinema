import type {Settings} from "$db/Settings";

export type Session = {
    isLoggedIn: boolean,
    user?: {
        email: string,
        username: string,
        hasCustomProfilePicture: boolean,
        settings: Settings
    }
}