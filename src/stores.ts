import {writable} from "svelte/store";
import type {AccountSession} from "./data/AccountSession";

export const accountSession = writable<AccountSession>(undefined);