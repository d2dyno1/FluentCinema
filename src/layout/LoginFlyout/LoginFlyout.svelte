<script>
    import {Button, Flyout, TextBlock} from "fluent-svelte";
    import {default as Login} from "../Login.svelte";
    import {default as Register} from "../Register.svelte";

    let isLogin = true;
</script>

<Flyout placement="top" offset={200}>
    <Button>Log in</Button>
    <div slot="override">
        {#if isLogin}
            <Login>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLogin = false}>Sign up</a></TextBlock>
            </Login>
        {:else}
            <Register>
                <TextBlock>Don't have an account? <a href="#" on:click={() => isLogin = true}>Log in</a></TextBlock>
            </Register>
        {/if}
    </div>
</Flyout>

<style lang="scss">
    @use "LoginFlyout";
</style>