<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/auth";

    let email: String;
    let password: String;

    let showError = false;
    let errorMessage;

    function onLogin() {
        let isEmailValid = emailValidationRegex.test(email);
        if (!isEmailValid) {
            showError = true;
            errorMessage = "Invalid e-mail.";
        } else if (password.length == 0) {
            showError = true;
            errorMessage = "Password cannot be empty.";
        } else {
            showError = false;
        }

        if (!showError) {
            fetch("/api/login", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            // todo handle response
        }
    }
</script>

<div>
    <TextBlock variant="title">Log in</TextBlock>
    <InfoBar bind:open={showError} bind:message={errorMessage} severity="critical" class="full-width"/>
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