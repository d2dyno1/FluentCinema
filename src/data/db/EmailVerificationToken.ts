export type EmailVerificationToken = {
    user_id: number,
    token: string,
    expires_at: Date
}