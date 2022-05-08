export type Session = {
    isLoggedIn: boolean,
    user?: {
        email: string,
        username: string
    }
}