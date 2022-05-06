<script lang="ts">
    import { Button, PersonPicture, Tooltip } from "fluent-svelte";
    import type { Account } from "src/data/account";
    import type { NavbarButton, NavbarItem } from "src/data/navbar";

    export let account: Account;
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
        <Button>
            {#if account}
                {account.name}
                <PersonPicture size={32} alt={account.name} src={account.image} />
            {:else}
                Login
                <PersonPicture size={32} alt="?" />
            {/if}
        </Button>
    </div>
</header>


<style lang="scss">
    @use "Navbar";
</style>