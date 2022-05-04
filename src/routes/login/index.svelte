<script lang="ts">
    import { TextBox, TextBlock, Button } from "fluent-svelte";

    let validEmailRegex = /.*@.*\..*/;

    let email: String;
    let password: String;

    let isEmailValid = true;

    function onLogin(button) {
        isEmailValid = validEmailRegex.test(email);
    }
</script>

<div>
    <TextBlock variant="title">Log in</TextBlock>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    {#if !isEmailValid}
        <label class="red">Invalid e-mail address.</label>
    {/if}
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <Button variant="accent" on:click={() => onLogin(this)}>Log in</Button>
    <a href="/resetpassword">Forgot password?</a>
    <hr>
    <TextBlock>Don't have an account? <a>Sign up</a></TextBlock>
</div>

<style lang="scss">
    @use "login";
</style>