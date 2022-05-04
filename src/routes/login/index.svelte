<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button } from "fluent-svelte";

    let emailValidationRegex = /.*@.*\..*/;

    let email: String;
    let password: String;

    let isEmailInvalid = false;

    function onLogin() {
        isEmailInvalid = !emailValidationRegex.test(email);
    }
</script>

<div>
    <TextBlock variant="title">Log in</TextBlock>
    <InfoBar bind:open={isEmailInvalid} message="Invalid e-mail address." severity="critical" class="full-width"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <Button variant="accent" on:click={onLogin}>Log in</Button>
    <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
    <hr>
    <TextBlock>Don't have an account? <a href="/register">Sign up</a></TextBlock>
</div>

<style lang="scss">
    @use "login";
</style>