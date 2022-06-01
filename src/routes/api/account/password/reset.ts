import type { RequestHandler } from "@sveltejs/kit";
import type { ResetPasswordSchema } from "$data/schema/ResetPasswordSchema";
import { badRequest, badRequestWithMessage, internalServerError, ok } from "$api/responses";
import { AccountController } from "$db/AccountController";
import { resetPasswordSchema } from "$data/schema/ResetPasswordSchema";
import { ResetPasswordController } from "$db/ResetPasswordController";
import { SessionController } from "$db/SessionController";

export const post: RequestHandler<any, any> = async ({ request }) => {
    if (await SessionController.getFromRequest(request) != null) {
        return badRequest;
    }

    let params: ResetPasswordSchema = await request.json();
    if (!await resetPasswordSchema.isValid(params)) {
        return badRequest;
    }

    let user: AccountController | null = null;
    let resetPassword: ResetPasswordController | null = null;
    if (params.email != null) {
        user = await AccountController.getFromEmail(params.email);
    } else if (params.token != null) {
        resetPassword = await ResetPasswordController.getFromToken(params.token);
        if (resetPassword != null) {
            user = await resetPassword.getUser();
        }
    }

    if (user == null) {
        if (params.email != null) {
            return badRequestWithMessage("This e-mail address is not associated with any account.");
        }
        return badRequest;
    }

    if (params.token == null) {
        await ResetPasswordController.beginProcess(user);
        return ok;
    }

    if (resetPassword == null) {
        return {
            status: 400,
            body: {
                success: false,
                isTokenValid: false
            }
        }
    }

    if (params.newPassword == null) {
        return {
            status: 200,
            body: {
                success: true,
                isTokenValid: true
            }
        }
    }
    await user.changePassword(params.newPassword);
    await resetPassword.invalidate();
    return ok;
}