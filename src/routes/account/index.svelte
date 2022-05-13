<script lang="ts" context="module">
    import type { NavigationItem } from "$data/navigation";
    import { AccountCard } from "$lib";
    import { ok } from "$lib/responses";
    import type { Session } from "$data/Session";
    import Preferences from "./preferences/preferences.svelte";
    import Reservations from "./reservations/reservations.svelte";

    const navItems: NavigationItem[] = [
        {
            name: "Account preferences",
            component: Preferences
        },
        {
            name: "Your reservations",
            component: Reservations
        }
    ];

    let session_: Session;
    let selectedItem: NavigationItem = navItems[0];

    export async function load({ session }) {
        session_ = session;
        return ok;
    }
</script>

<div>
    <AccountCard bind:selectedItem={selectedItem} session={session_} navItems={navItems}/>
    <svelte:component this={selectedItem.component}/>
</div>

<style lang="scss">
    @use "account";
</style>