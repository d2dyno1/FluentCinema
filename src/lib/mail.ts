import credentials from "../../credentials.json";
import nodemailer from "nodemailer";
import type { User } from "../data/User";

const transporter = nodemailer.createTransport(credentials.mail);

export async function sendMail(user: User, subject: string, data: string) {
    return await transporter.sendMail({
        from: "FluentCinema <fluentcinema+noreply@zsti.eu>",
        to: `${user.username} <${user.email}>`,
        subject: subject,
        text: data
    });
}