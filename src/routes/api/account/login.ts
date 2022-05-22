import { badRequest, badRequestWithMessage, forbidden, forbiddenWithMessage } from "$api/responses";
import { AccountDatabaseContext } from "$db/AccountDatabaseContext";
import { SessionDatabaseContext } from "$db/SessionDatabaseContext";
import { loginSchema } from "$data/schema/LoginSchema";
import { TwoFactorAuthenticationDatabaseContext } from "$db/TwoFactorAuthenticationDatabaseContext";
import type { RequestHandler } from "@sveltejs/kit";
import type { LoginSchema } from "$data/schema/LoginSchema";

export const post: RequestHandler = async ({ request }) => {
    if (await SessionDatabaseContext.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.isValid(params)) {
        return badRequest;
    }

    let user = await AccountDatabaseContext.getFromEmail(params.email);
    if (user == null) {
        return badRequestWithMessage("Account does not exist.");
    } else if (!await user.verifyPassword(params.password)) {
        return forbiddenWithMessage("Incorrect password.");
    }

    if ((await user.getSettings()).twoFactorAuthentication) {
        if (!params.otp) {
            await TwoFactorAuthenticationDatabaseContext.sendOtpToUser(user);
            return {
                status: 200,
                body: {
                    success: false,
                    otpRequired: true
                }
            }
        } else if (!await TwoFactorAuthenticationDatabaseContext.isValid(user, params.otp)) {
            return badRequestWithMessage("Incorrect one-time password.");
        }
    }
    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            'Set-Cookie': (await SessionDatabaseContext.create(user)).getCookie()
        }
    };
}