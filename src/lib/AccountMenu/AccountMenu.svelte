<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock, MenuFlyout, MenuFlyoutItem, MenuFlyoutDivider } from "fluent-svelte";
    import { default as LoginForm } from "../../layout/../layout/LoginForm.svelte";
    import { default as RegisterForm } from "../../layout/../layout/RegisterForm.svelte";
    import type { Session } from "$data/session";
    
    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import EyeIcon from "@fluentui/svg-icons/icons/eye_24_filled.svg?raw";
    import DoorArrowLeftIcon from "@fluentui/svg-icons/icons/door_arrow_left_24_filled.svg?raw";

    export let session: Session;

    let isLoginPage = true;

    function logOut() {
        fetch("/api/account/logout", { method: "POST" }).then(() => window.location.replace("/"));
    }
</script>

{#if session.isLoggedIn}
<MenuFlyout placement="bottom" alignment="end">
    <Button>
        <div class="inner-login-button">
            {session.user.username}
            <PersonPicture size={32} alt={session.user.username}>
                {#if session.user.hasCustomProfilePicture}
                    <img class="user-picture" alt={session.user.username} src="/api/account/picture/current">
                {:else}
                    {@html ProfileIcon}
                {/if}
            </PersonPicture>
        </div>
    </Button>
    <div slot="flyout">
        <MenuFlyoutItem on:click={() => window.location.replace("/settings")}>
            {@html ProfileIcon}
            FluentCinema Account
        </MenuFlyoutItem>
        <MenuFlyoutItem on:click>
            {@html EyeIcon}
            View reservations
        </MenuFlyoutItem>
        <MenuFlyoutDivider/>
        <MenuFlyoutItem on:click={logOut}>
            {@html DoorArrowLeftIcon}
            Log out
        </MenuFlyoutItem>
    </div>
</MenuFlyout>
{:else}
<Flyout placement="bottom" alignment="end">
    <Button>
        <div class="inner-login-button">
            Login
            <PersonPicture class="account-picture" size={32} alt="?">
                {@html ProfileIcon}
            </PersonPicture>
        </div>
    </Button>
    <div class="inner" slot="override">
        {#if isLoginPage}
            <LoginForm>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLoginPage = false}>Sign up</a></TextBlock>
            </LoginForm>
        {:else}
            <RegisterForm>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLoginPage = true}>Log in</a></TextBlock>
            </RegisterForm>
        {/if}
    </div>
</Flyout>
{/if}

<style lang="scss">
    @use "AccountMenu";
</style>