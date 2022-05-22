<script lang="ts">
    import { page } from "$app/stores";
    import { Tooltip } from "fluent-svelte";
    import { AccountMenu } from "$lib";
    import type { NavbarButton, NavbarItem } from "$data/navbar";

    export let navbarItems: NavbarItem[] = [];
    export let navbarButtons: NavbarButton[] = [];
</script>

<header class="navbar">
    <nav>
        <a href="/" class="app-title">
            FluentCinema
        </a>
        <div class="divider"></div>
        {#each navbarItems as navbarItem}
            {#if navbarItem.type == "divider"}
                <div class="divider"></div>
            {:else}
                <a
                    class="navbar-item"
                    href={navbarItem.path}
                    class:selected={$page.url.pathname == navbarItem.path}>

                    {#if navbarItem.icon}
                        {@html navbarItem.icon}
                    {/if}
                    {navbarItem.name}
                </a>
            {/if}
        {/each}
    </nav>
    <div class="navbar-buttons">
        {#each navbarButtons as { name, path, icon }}
            <Tooltip class="navbar-button" placement="bottom" text={name}>
                <a href={path}>
                    {@html icon}
                </a>
            </Tooltip>
        {/each}
        <AccountMenu/>
    </div>
</header>


<style lang="scss">
    @use "Navbar";
</style>