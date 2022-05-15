import {writable} from "svelte/store";
import type {Session} from "$data/Session";

export const accountSession = writable<Session>(undefined);