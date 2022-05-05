<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/validation";
    import { CenteredForm } from "../layout";

    let email: String;
    let password: String;

    let isError = false;
    let errorMessage: String;

    function showError(message: String) {
        isError = true;
        errorMessage = message;
    }

    let promise: Promise<Response>;

    function onLogin() {
        let isEmailValid = emailValidationRegex.test(email);
        if (!isEmailValid) {
            showError("Invalid e-mail.");
        } else if (password.length == 0) {
            showError("Password cannot be empty.");
        } else {
            isError = false;
        }

        if (!isError) {
            promise = fetch("/api/login", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            promise.then(response => response.json()).then(response => {
                if (!response.success) {
                    showError(response.message);
                }
                promise = null;
            });
            promise.catch(error => {
                showError(error.message);
                promise = null;
            });
        }
    }
</script>

<CenteredForm>
    <TextBlock variant="title">Log in</TextBlock>
    <InfoBar bind:open={isError} bind:message={errorMessage} severity="critical" class="full-width"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <div class="horizontal-flex">
        {#if promise == null}
            <Button variant="accent" on:click={onLogin}>Log in</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
    <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
    <hr>
    <TextBlock>Don't have an account? <a href="/register">Sign up</a></TextBlock>
</CenteredForm>

<style lang="scss">
    @use "../styles/global";
</style>