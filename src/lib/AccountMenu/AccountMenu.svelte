<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock } from "fluent-svelte";
    import type { User } from "$data/User";
    import { default as LoginForm } from "../../layout/../layout/LoginForm.svelte";
    import { default as RegisterForm } from "../../layout/../layout/RegisterForm.svelte";
    
    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg";

    export let user: User;

    let isLoginPage = true;
</script>

<Flyout placement="bottom" alignment="end" offset={8}>
    <Button>
        <div class="inner-login-button">
            {#if user}
                {user.username}
                <PersonPicture size={32} alt={user.username}>
                    <img class="user-picture" src="/api/userPicture">
                </PersonPicture>
            {:else}
                Login
                <PersonPicture class="account-picture" size={32} alt="?">
                    <img class="user-picture" src={ProfileIcon}>
                </PersonPicture>
            {/if}
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

<style lang="scss">
    @use "AccountMenu";
</style>