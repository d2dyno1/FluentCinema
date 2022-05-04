<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button } from "fluent-svelte";

    let validEmailRegex = /.*@.*\..*/;

    let email: String;
    let password: String;

    let isEmailValid = true;

    function onLogin() {
        isEmailValid = validEmailRegex.test(email);
    }
</script>

<div>
    <TextBlock variant="title">Log in</TextBlock>
    {#if !isEmailValid}
        <InfoBar title="Invalid e-mail address." severity="critical"/>
    {/if}
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <Button variant="accent" on:click={onLogin}>Log in</Button>
    <a href="/resetpassword">Forgot password?</a>
    <hr>
    <TextBlock>Don't have an account? <a href="/register">Sign up</a></TextBlock>
</div>

<style lang="scss">
    @use "login";
</style>