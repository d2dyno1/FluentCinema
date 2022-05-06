<script lang="ts">
    import { Tooltip } from "fluent-svelte";
import type { NavbarButton, NavbarItem } from "src/data/navbar";

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
            <Tooltip placement="bottom" text={name}>
                <a class="navbar-button" href={path}>
                    {@html icon}
                </a>
            </Tooltip>
        {/each}
    </div>
</header>


<style lang="scss">
    @use "Navbar";
</style>