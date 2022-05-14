import type {Settings} from "../lib/db/Settings";

export type Session = {
    isLoggedIn: boolean,
    user?: {
        email: string,
        username: string,
        hasCustomProfilePicture: boolean,
        settings: Settings
    }
}