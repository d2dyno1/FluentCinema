<script lang="ts">
    import type { Session } from "$data/session";
    import type { NavigationItem } from "$data/navigation";
    import { NavigationList } from "$lib";
    import { PersonPicture } from "fluent-svelte";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";

    export let navItems: NavigationItem[] = [];
    export let session: Session;
    export let selectedItem: NavigationItem;

</script>

<div class="wrapper">
    <div class="card">
        {#if session.isLoggedIn}
            <PersonPicture size={64} class="account-img" src="/api/account/picture/current" alt="?">
                {#if session.user.hasCustomProfilePicture}
                    <img class="user-picture" alt={session.user.username} src="/api/account/picture/current">
                {:else}
                    {@html ProfileIcon}
                {/if}
            </PersonPicture>
            <div>{session.user.username}</div>
            <div class="email-text">{session.user.email}</div>
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