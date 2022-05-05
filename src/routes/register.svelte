<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex, passwordValidationRegex } from "../lib/validation";
    import { CenteredForm } from "../layout";

    let isError = false;
    let errorMessage: String;

    function showError(message: String) {
        isError = true;
        errorMessage = message;
        showSuccessfullyRegisteredMessage = false;
    }

    let email: String;
    let password: String;
    let confirmedPassword: String;
    $: isPasswordInvalid = !passwordValidationRegex.test(password);

    let promise: Promise<Response>;
    let showSuccessfullyRegisteredMessage = false;

    function onRegister() {
        if (!emailValidationRegex.test(email)) {
            showError("Invalid e-mail address address.");
            return;
        } else if (password != confirmedPassword) {
            showError("Passwords don't match.");
            return;
        } else {
            isError = false;
        }

        if (!isPasswordInvalid) {
            promise = fetch("/api/register", {
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
                if (response.success) {
                    showSuccessfullyRegisteredMessage = true;
                } else {
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
    <TextBlock variant="title">Register</TextBlock>
    <InfoBar bind:open={showSuccessfullyRegisteredMessage} message="Your account has been created successfully. Before logging in, please verify your e-mail by clicking the link that was sent to it." severity="success" closable={false} class="full-width"/>
    <InfoBar bind:open={isError} bind:message={errorMessage} severity="critical" class="full-width"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"/>
    <TextBox bind:value={password} type="password" placeholder="Password"/>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"/>
    <InfoBar bind:open={isPasswordInvalid} message="A password must consist of at least eight characters, including an uppercase letter, a digit and a special character." severity="caution" class="full-width" closable={false}/>
    <div class="horizontal-flex">
        {#if promise == null}
            <Button variant="accent" on:click={onRegister}>Register</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
    <hr>
    <TextBlock>Already have an account? <a href="/login">Log in</a></TextBlock>
</CenteredForm>

<style lang="scss">
    @use "../styles/global";
</style>