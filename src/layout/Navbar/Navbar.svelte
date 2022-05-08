<script lang="ts">
    import { Tooltip } from "fluent-svelte";
    import { AccountMenu } from "$lib";
    import type { User } from "$data/User";
    import type { NavbarButton, NavbarItem } from "$data/navbar";
    import {ok} from "../../lib/responses";
    import type {Session} from "../../data/Session";

    export let session: Session;
    export let navbarItems: NavbarItem[] = [];
    export let navbarButtons: NavbarButton[] = [];
</script>

<header class="navbar">
    <nav>
        <a href="/" class="app-title">
            FluentCinema
        </a>
        <div class="divider"></div>
        {#each navbarItems as { name, path, type, icon }}
            {#if type == "divider"}
                <div class="divider"></div>
            {:else}
                <a 
                    class="navbar-item"
                    href={path}
                    class:selected={false}>
                    {#if icon}
                        {@html icon}
                    {/if}
                    {name}
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
        <AccountMenu session={session}/>
    </div>
</header>


<style lang="scss">
    @use "Navbar";
</style>