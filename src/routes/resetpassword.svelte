<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/validation";
    import { DialogForm } from "$layout";

    let email: string;
    let formComponent: any;
    let promise: Promise<Response>;

    function onLogin() {
        let isEmailValid = emailValidationRegex.test(email);
        if (!isEmailValid) {
            formComponent.showCriticalMessage("Invalid e-mail address.");
            return;
        }
        formComponent.hideMessage();

        promise = fetch("/api/account/password/reset", {
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
                formComponent.showSuccessMessage("A password reset link has been sent to your e-mail.");
            } else {
                formComponent.showCriticalMessage(response.message);
            }
            promise = null;
        });
        promise.catch(error => {
            formComponent.showCriticalMessage(error.message);
            promise = null;
        });
    }
</script>

<DialogForm title="Reset password" bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <div slot="footer-right">
        {#if promise == null}
            <Button variant="accent" on:click={onLogin}>Reset password</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>