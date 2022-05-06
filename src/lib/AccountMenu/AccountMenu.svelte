<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock } from "fluent-svelte";
    import type { Account } from "$data/account";
    import { default as LoginForm } from "../../layout/../layout/LoginForm.svelte";
    import { default as RegisterForm } from "../../layout/../layout/RegisterForm.svelte";
    
    export let account: Account;

    let isLogin = true;
</script>

<Flyout placement="bottom" alignment="end" offset={8}>
    <Button>
        {#if account}
            {account.name}
            <PersonPicture size={32} alt={account.name} src={account.image} />
        {:else}
            Login
            <PersonPicture size={32} alt="?" />
        {/if}
    </Button>
    <div slot="override">
        {#if isLogin}
            <LoginForm>
                <TextBlock>Don't have an account? <a href="" on:click={() => isLogin = false}>Sign up</a></TextBlock>
            </LoginForm>
        {:else}
            <RegisterForm>
                <TextBlock>Don't have an account? <a href="" on:click={() => isLogin = true}>Log in</a></TextBlock>
            </RegisterForm>
        {/if}
    </div>
</Flyout>

<style lang="scss">
    @use "AccountMenu";
</style>