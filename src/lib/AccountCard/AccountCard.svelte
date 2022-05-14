<script lang="ts">
    import type { NavigationItem } from "$data/navigation";
    import { NavigationList } from "$lib";
    import { PersonPicture } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";

    export let navItems: NavigationItem[] = [];
    export let selectedItem: NavigationItem;
</script>

<div class="wrapper">
    <div class="card">
        {#if $accountSession.isLoggedIn}
            <PersonPicture size={64} class="account-img" src="/api/account/picture/current" alt="?">
                {#if $accountSession.user.hasCustomProfilePicture}
                    <img class="user-picture" alt={$accountSession.user.username} src="/api/account/picture/current">
                {:else}
                    {@html ProfileIcon}
                {/if}
            </PersonPicture>
            <div>{$accountSession.user.username}</div>
            <div class="email-text">{$accountSession.user.email}</div>
        {:else}
            <div>AccountName</div>
            <div class="email-text">Email</div>
        {/if}
    </div>

    <div class="navigation">
        <NavigationList bind:selectedItem={selectedItem} items={navItems}/>
    </div>
</div>

<style lang="scss">
    @use "AccountCard";
</style>