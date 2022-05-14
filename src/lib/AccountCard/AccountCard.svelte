<script lang="ts">
    import type { NavigationItem } from "$data/navigation";
    import { AccountPicture, NavigationList } from "$lib";
    import { accountSession } from "$/stores";

    export let navItems: NavigationItem[] = [];
    export let selectedItem: NavigationItem;
</script>

<div class="wrapper">
    <div class="card">
        {#if $accountSession.isLoggedIn}
            <AccountPicture class="account-img" size={64} userId={$accountSession.user.id}/>
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