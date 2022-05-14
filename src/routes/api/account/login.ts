import { badRequest, badRequestWithMessage, forbidden, forbiddenWithMessage } from "$api/responses";
import type { RequestHandler } from "@sveltejs/kit";
import { User } from "$db/User";
import { Session } from "$db/Session";
import { loginSchema } from "$data/schema/LoginSchema";
import type {LoginSchema } from "$data/schema/LoginSchema";
import { TwoFactorAuthentication } from "../../../db/TwoFactorAuthentication";

export const post: RequestHandler = async ({ request }) => {
    if (await Session.getFromRequest(request) != null) {
        return forbidden;
    }

    let params: LoginSchema = await request.json();
    if (!await loginSchema.isValid(params)) {
        return badRequest;
    }

    let user = await User.getFromEmail(params.email);
    if (user == null) {
        return badRequestWithMessage("Account does not exist.");
    } else if (!await user.verifyPassword(params.password)) {
        return forbiddenWithMessage("Incorrect password.");
    }

    if ((await user.getSettings()).twoFactorAuthentication) {
        if (!params.otp) {
            await TwoFactorAuthentication.sendOtpToUser(user);
            return {
                status: 200,
                body: {
                    success: false,
                    otpRequired: true
                }
            }
        } else if (!await TwoFactorAuthentication.isValid(user, params.otp)) {
            return badRequestWithMessage("Incorrect one-time password.");
        }
    }
    return {
        status: 200,
        body: {
            success: true
        },
        headers: {
            'Set-Cookie': (await Session.create(user)).getCookie()
        }
    };
}