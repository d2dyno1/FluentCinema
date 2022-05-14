import type {Session as AccountSession} from "$data/Session";

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
