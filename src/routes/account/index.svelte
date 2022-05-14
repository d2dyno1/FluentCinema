<script lang="ts" context="module">
    import type { NavigationItem } from "$data/navigation";
    import { AccountCard } from "$lib";
    import type {Load} from "@sveltejs/kit";
    import {ok} from "$api/responses";

    export const load: Load = async ({ session }) => {
        if (!session.isLoggedIn) {
            return {
                status: 302,
                redirect: "/"
            }
        }
        return ok;
    };
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
    <div class="card">
        <AccountCard bind:selectedItem={selectedItem} navItems={navItems}/>
    </div>
    <div class="content">
        <div class="title">{selectedItem.name}</div>
        <svelte:component this={selectedItem.component}/>
    </div>
</div>

<style lang="scss">
    @use "account";
</style>