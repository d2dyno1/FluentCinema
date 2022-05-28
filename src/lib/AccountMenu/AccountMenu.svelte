<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock, MenuFlyout, MenuFlyoutItem, MenuFlyoutDivider } from "fluent-svelte";
    import { default as LoginForm } from "$layout/LoginForm.svelte";
    import { default as RegisterForm } from "$layout/RegisterForm.svelte";
    import { accountSession } from "$/stores";
    import { AccountPicture } from "$lib";
    import {AccountApiContext} from "../../api/AccountApiContext";
    import { goto } from "$app/navigation";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import EyeIcon from "@fluentui/svg-icons/icons/eye_24_filled.svg?raw";
    import DoorArrowLeftIcon from "@fluentui/svg-icons/icons/door_arrow_left_24_filled.svg?raw";

    let isLoginPage = true;

    async function logout() {
        await AccountApiContext.logout();
        window.location.reload();
    }
</script>

{#if $accountSession.isLoggedIn}
<MenuFlyout placement="bottom" alignment="end">
    <Button>
        <div class="inner-login-button">
            {$accountSession.user.username}
            <AccountPicture size={32} userId={$accountSession.user.id}/>
        </div>
    </Button>
    <div slot="flyout">
        <MenuFlyoutItem on:click={() => goto("/account")}>
            {@html ProfileIcon}
            FluentCinema Account
        </MenuFlyoutItem>
        <MenuFlyoutItem on:click>
            {@html EyeIcon}
            View reservations
        </MenuFlyoutItem>
        <MenuFlyoutDivider/>
        <MenuFlyoutItem on:click={logout}>
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