<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock, MenuFlyout, MenuFlyoutItem, MenuFlyoutDivider } from "fluent-svelte";
    import type { User } from "$data/User";
    import { default as LoginForm } from "../../layout/../layout/LoginForm.svelte";
    import { default as RegisterForm } from "../../layout/../layout/RegisterForm.svelte";
    
    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";

    export let user: User;

    let isLoginPage = true;

    function logOut() {
        fetch("/api/logout", { method: "POST" }).then(() => window.location.replace(""));
    }
</script>

{#if user}
<MenuFlyout placement="bottom" alignment="end">
    <Button>
        <div class="inner-login-button">
            {user.username}
            <PersonPicture size={32} alt={user.username}>
                <img class="user-picture" alt={user.username} src="/api/userPicture">
            </PersonPicture>
        </div>
    </Button>
    <div slot="flyout">
        <MenuFlyoutItem on:click>
            {@html ProfileIcon}
            FluentCinema Accout
        </MenuFlyoutItem>
        <MenuFlyoutItem on:click>
            View reservation
        </MenuFlyoutItem>
        <MenuFlyoutDivider/>
        <MenuFlyoutItem on:click={logOut}>
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