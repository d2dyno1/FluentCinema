import { AccountController } from "./AccountController";
import moment from "moment";
import { client } from "$db/index";
import { promisify } from "util";
import crypto from "crypto";

const randomBytesAsync = promisify(crypto.randomBytes);

const BASE_URL = "https://fluentcinema.zsti.eu/resetpassword?token=";
const TOKEN_LIFESPAN = 15; // in minutes

export class ResetPasswordController {
    private id!: number;
    private userId!: string;
    private token!: string;
    private expiresAt!: Date;

    private constructor(resetPassword: Partial<ResetPasswordController>) {
        Object.assign(this, resetPassword);
    }

    async getUser(): Promise<AccountController | null> {
        return AccountController.getFromId(this.userId);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expiresAt);
    }

    async invalidate() {
        await client.query("DELETE FROM reset_password WHERE token=$1;", [this.token]);
    }

    static async getFromToken(token: string): Promise<ResetPasswordController | null> {
        let query = await client.query("SELECT * FROM reset_password WHERE token=$1;", [token]);
        if (query.rowCount == 1) {
            let resetPassword = new ResetPasswordController(query.rows[0]);
            if (resetPassword.isExpired()) {
                await resetPassword.invalidate();
                return null;
            }
            return resetPassword;
        }
        return null;
    }

    static async beginProcess(user: AccountController) {
        let link = await this.generateLink(user);
        await user.sendMail("Password reset", `A password reset has been requested. In order to change your password, please click on the link below.
${link}
If you did not request this, you can safely ignore this message.`);
    }

    private static async generateLink(user: AccountController): Promise<string> {
        let bytes = await randomBytesAsync(128);
        let token = bytes.toString("base64");
        let expiresAt = moment().add(TOKEN_LIFESPAN, "minutes").toDate();
        await client.query(`INSERT INTO reset_password("userId", token, "expiresAt") VALUES ($1, $2, $3);`, [user.id, token, expiresAt]);
        return BASE_URL + encodeURIComponent(token);
    }

    static async deleteExpiredEntries(): Promise<void> {
        await client.query(`DELETE FROM reset_password WHERE $1 > "expiresAt";`, [new Date()]);
    }
}

setInterval(async () => {
    await ResetPasswordController.deleteExpiredEntries();
}, 600000);