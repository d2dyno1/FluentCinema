<script lang="ts">
    import { PersonPicture, Button, Flyout, TextBlock } from "fluent-svelte";
    import type { Account } from "$data/account";
    import { default as Login } from "../../layout/../layout/Login.svelte";
    import { default as Register } from "../../layout/../layout/Register.svelte";
    
    export let account: Account;

    let isLogin = true;
</script>

<Flyout placement="top" offset={200}>
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
            <Login>
                <TextBlock>Don't have an account? <a href="" on:click={() => isLogin = false}>Sign up</a></TextBlock>
            </Login>
        {:else}
            <Register>
                <TextBlock>Don't have an account? <a href="" on:click={() => isLogin = true}>Log in</a></TextBlock>
            </Register>
        {/if}
    </div>
</Flyout>

<style lang="scss">
    @use "AccountMenu";
</style>