<script lang="ts">
    import { TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex } from "../lib/validation";
    import { DialogForm } from "$layout";

    let email: String;
    let password: String;

    let formComponent;

    let promise: Promise<Response>;

    function onLogin() {
        let isEmailValid = emailValidationRegex.test(email);
        if (!isEmailValid) {
            formComponent.showCriticalMessage("Invalid e-mail address.");
            return;
        } else if (password.length == 0) {
            formComponent.showCriticalMessage("Password cannot be empty.");
            return;
        }

        formComponent.hideMessage();

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
            if (response.success) {
                formComponent.showSuccessMessage("Successfully logged in.");
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

<DialogForm title="Log in" bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <div slot="footer-left">
        <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
    </div>
    <div slot="footer-right">
        {#if promise == null}
            <Button variant="accent" on:click={onLogin}>Log in</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>