import type {AccountSession as AccountSession} from "./data/AccountSession";

declare global {
    declare namespace App {
        interface Locals {
            session: Session | null
        };

        interface Session extends AccountSession {}

        // interface Platform {}
        // interface Session {}
        // interface Stuff {}
    }
}
