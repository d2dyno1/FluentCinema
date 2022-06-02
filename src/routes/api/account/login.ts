import { badRequest, badRequestWithMessage, forbidden, forbiddenWithMessage } from "$api/responses";
import { AccountController } from "$db/AccountController";
import { SessionController } from "$db/SessionController";
import { loginSchema } from "$data/schema/LoginSchema";
import { TwoFactorAuthenticationController } from "$db/TwoFactorAuthenticationController";
import type { RequestHandler } from "@sveltejs/kit";
import type { LoginSchema } from "$data/schema/LoginSchema";

export const post: RequestHandler = async ({ request }) => {
    if (await SessionController.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.isValid(params)) {
        return badRequest;
    }

    let user = await AccountController.getFromEmail(params.email);
    if (user == null) {
        return badRequestWithMessage("Account does not exist.");
    } else if (!await user.verifyPassword(params.password)) {
        return forbiddenWithMessage("Incorrect password.");
    }

    if ((await user.getSettings()).twoFactorAuthentication) {
        if (!params.otp) {
            await TwoFactorAuthenticationController.sendOtpToUser(user);
            return {
                status: 200,
                body: {
                    success: true,
                    otpRequired: true
                }
            }
        } else if (!await TwoFactorAuthenticationController.isValid(user, params.otp)) {
            return badRequestWithMessage("Incorrect one-time password.");
        }
    }
    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            'Set-Cookie': (await SessionController.create(user)).getCookie()
        }
    };
}