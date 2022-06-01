import type { AccountSession } from "$data/AccountSession";
import { writable } from "svelte/store";

export const accountSession = writable<AccountSession>(undefined);