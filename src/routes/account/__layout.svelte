<script lang="ts" context="module">
    import type { NavigationItem } from "$data/navigation";
    import type { Load } from "@sveltejs/kit";
    import { AccountCard } from "$lib";
    import { ok } from "$api/responses";

    export let href: string;

    export const load: Load = async ({ session, url }) => {
        href = url.pathname;
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
    const navItems: NavigationItem[] = [
        {
            name: "Account preferences",
            href: "/account/preferences"
        },
        {
            name: "Your reservations",
            href: "/account/reservations"
        }
    ];

    let selectedItem = navItems.find(item => item.href == href);
</script>

<div class="wrapper">
    <div class="card">
        <AccountCard bind:selectedItem={selectedItem} navItems={navItems}/>
    </div>
    <div class="content">
        <div class="title">{selectedItem.name}</div>
        <slot/>
    </div>
</div>

<style lang="scss">
    @use "account";
</style>