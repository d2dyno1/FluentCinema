<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/validation";
    import { CenteredForm } from "../layout";

    let email: String;

    let isError = false;
    let errorMessage: String;

    function showError(message: String) {
        isError = true;
        errorMessage = message;
        showLinkSentMessage = false;
    }

    let promise: Promise<Response>;
    let showLinkSentMessage = false;

    function onLogin() {
        let isEmailValid = emailValidationRegex.test(email);
        if (!isEmailValid) {
            showError("Invalid e-mail address.");
        } else {
            isError = false;
        }

        if (!isError) {
            promise = fetch("/api/resetpassword", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: email
                })
            });
            promise.then(response => response.json()).then(response => {
                if (response.success) {
                    showLinkSentMessage = true;
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
    <TextBlock variant="title">Reset password</TextBlock>
    <InfoBar bind:open={showLinkSentMessage} message="A password reset link has been sent to your e-mail." severity="success" closable={false} class="full-width"/>
    <InfoBar bind:open={isError} bind:message={errorMessage} severity="critical" class="full-width"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <div class="horizontal-flex">
        {#if promise == null}
            <Button variant="accent" on:click={onLogin}>Reset password</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
</CenteredForm>

<style lang="scss">
    @use "../styles/global";
</style>