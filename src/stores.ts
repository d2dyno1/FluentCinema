import {writable} from "svelte/store";
import type {Session} from "$data/session";

export const accountSession = writable<Session>(undefined);