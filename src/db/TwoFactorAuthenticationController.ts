import crypto from "crypto";
import { promisify } from "util";
import { client } from ".";
import moment from "moment";
import type { AccountController } from "$db/AccountController";
import type { IExpirable } from "./IExpirable";

const randomIntAsync = promisify(crypto.randomInt);

export class TwoFactorAuthenticationController implements IExpirable {
    private static readonly TOKEN_LIFESPAN = 5; // in minutes

    private readonly user_id!: string;
    private readonly otp!: string;
    private readonly expires_at!: Date;

    private constructor(twoFactorAuthentication: Partial<TwoFactorAuthenticationController>) {
        Object.assign(this, twoFactorAuthentication);
    }

    async invalidate() {
        await client.query("DELETE FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [this.user_id, this.otp]);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expires_at);
    }

    static async isValid(user: AccountController, otp: string) {
        let query = await client.query("SELECT * FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [user.id, otp]);
        if (query.rowCount == 0) {
            return false;
        }
        let twoFactorAuthentication = new TwoFactorAuthenticationController(query.rows[0]);
        await twoFactorAuthentication.invalidate();
        return !twoFactorAuthentication.isExpired();
    }

    static async sendOtpToUser(user: AccountController) {
        let code = await TwoFactorAuthenticationController.generateCode(user);
        await user.sendMail("Two-factor authentication", `Your two-factor authentication code: ${code}.
If you did not expect this message, someone else is trying to log into your account.`);
    }

    static async generateCode(user: AccountController) {
        let i = await randomIntAsync(1000000) as number;
        let otp = i.toString().padStart(6, "0");
        let expiresAt = moment().add(this.TOKEN_LIFESPAN, "minutes").toDate();
        await client.query("INSERT INTO two_factor_authentication(user_id, otp, expires_at) VALUES ($1, $2, $3);", [user.id, otp, expiresAt]);
        return otp;
    }

    static async deleteExpiredEntries(): Promise<void> {
        await client.query("DELETE FROM two_factor_authentication WHERE $1 > expires_at;", [new Date()]);
    }

}

setInterval(async () => {
    await TwoFactorAuthenticationController.deleteExpiredEntries();
}, 600000);