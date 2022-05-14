import crypto from "crypto";
import { promisify } from "util";
import {client} from ".";
import moment from "moment";
import type {User} from "./User";
import {Expirable, initializeExpiredEntryDeleter} from "./Expirable";

const randomIntAsync = promisify(crypto.randomInt);

const tokenTimespan = 5; // in minutes

export class TwoFactorAuthentication extends Expirable {
    private readonly user_id!: string;
    private readonly otp!: string;

    public async invalidate() {
        await client.query("DELETE FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [this.user_id, this.otp]);
    }

    public static async isValid(user: User, otp: string) {
        let query = await client.query("SELECT * FROM two_factor_authentication WHERE user_id=$1 AND otp=$2;", [user.id, otp]);
        if (query.rowCount == 0) {
            return false;
        }
        let twoFactorAuthentication: TwoFactorAuthentication = Object.assign(new TwoFactorAuthentication(), query.rows[0]);
        await twoFactorAuthentication.invalidate();
        return true;
    }

    public static async sendOtpToUser(user: User) {
        await user.sendMail("test", await TwoFactorAuthentication.generateCode(user));
    }

    public static async generateCode(user: User) {
        let i = await randomIntAsync(1000000) as number;
        let otp = i.toString().padStart(6, "0");
        let expiresAt = moment().add(tokenTimespan, "minutes").toDate();
        await client.query("INSERT INTO two_factor_authentication(user_id, otp, expires_at) VALUES ($1, $2, $3);", [user.id, otp, expiresAt]);
        return otp;
    }
}

initializeExpiredEntryDeleter(() => new TwoFactorAuthentication(), "two_factor_authentication");