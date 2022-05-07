<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock } from "fluent-svelte";
    import type { Account } from "$data/account";
    import { default as LoginForm } from "../../layout/../layout/LoginForm.svelte";
    import { default as RegisterForm } from "../../layout/../layout/RegisterForm.svelte";
    
    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw"

    export let account: Account;

    let isLogin = true;
</script>

<Flyout placement="bottom" alignment="end" offset={8}>
    <Button>
        <div class="inner-login-button">
            {#if account}
                {account.name}
                <PersonPicture size={32} alt={account.name} src={account.image} />
            {:else}
                Login
                <PersonPicture class="account-picture" size={32} alt="?">
                    <img src="/api/userPicture">
                </PersonPicture>
            {/if}
        </div>
    </Button>
    <div class="inner" slot="override">
        {#if isLogin}
            <LoginForm>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLogin = false}>Sign up</a></TextBlock>
            </LoginForm>
        {:else}
            <RegisterForm>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLogin = true}>Log in</a></TextBlock>
            </RegisterForm>
        {/if}
    </div>
</Flyout>

<style lang="scss">
    @use "AccountMenu";
</style>