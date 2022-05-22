import crypto from "crypto";
import { promisify } from "util";
import {client} from ".";
import moment from "moment";
import type {AccountDatabaseContext} from "./AccountDatabaseContext";
import type { IExpirable } from "./IExpirable";

const randomIntAsync = promisify(crypto.randomInt);

export class TwoFactorAuthenticationDatabaseContext implements IExpirable {
    private static readonly TOKEN_LIFESPAN = 5; // in minutes

    private readonly user_id!: string;
    private readonly otp!: string;
    private readonly expires_at!: Date;

    private constructor(twoFactorAuthentication: Partial<TwoFactorAuthenticationDatabaseContext>) {
        Object.assign(this, twoFactorAuthentication);
    }

    async invalidate() {
        await client.query("DELETE FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [this.user_id, this.otp]);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expires_at);
    }

    static async isValid(user: AccountDatabaseContext, otp: string) {
        let query = await client.query("SELECT * FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [user.id, otp]);
        if (query.rowCount == 0) {
            return false;
        }
        let twoFactorAuthentication = new TwoFactorAuthenticationDatabaseContext(query.rows[0]);
        await twoFactorAuthentication.invalidate();
        return !twoFactorAuthentication.isExpired();
    }

    static async sendOtpToUser(user: AccountDatabaseContext) {
        await user.sendMail("test", await TwoFactorAuthenticationDatabaseContext.generateCode(user));
    }

    static async generateCode(user: AccountDatabaseContext) {
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
    await TwoFactorAuthenticationDatabaseContext.deleteExpiredEntries();
}, 600000);