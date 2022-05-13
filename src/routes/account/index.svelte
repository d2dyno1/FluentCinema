<script lang="ts" context="module">
    import type { NavigationItem } from "$data/navigation";
    import { AccountCard } from "$lib";
    import { ok } from "$lib/responses";
    import type { Session } from "$data/Session";

    let session_: Session;

    export async function load({ session }) {
        session_ = session;
        return ok;
    }
</script>

<script lang="ts">
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
    let selectedItem = navItems[0];
</script>

<div class="wrapper">
    <AccountCard bind:selectedItem={selectedItem} session={session_} navItems={navItems}/>
    <svelte:component this={selectedItem.component}/>
</div>

<style lang="scss">
    @use "account";
</style>