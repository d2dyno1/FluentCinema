<script lang="ts">
    import type { Session } from "$data/Session";
    import type { NavigationItem } from "$data/navigation";
    import { PersonPicture } from "fluent-svelte";
    import { NavigationList } from "$lib";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";

    const navItems: NavigationItem[] = [
        {
            name: "Account preferences",
        },
        {
            name: "Your reservations"
        }
    ];

    export let session: Session;

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
        <NavigationList selectedItem={navItems[0]} items={navItems}/>
    </div>
</div>

<style lang="scss">
    @use "AccountCard";
</style>