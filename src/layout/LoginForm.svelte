<script lang="ts">
    import { TextBox, TextBlock, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/validation";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";

    let email: string;
    let password: string;

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
        <PromiseButton variant="accent" bind:promise={promise} on:click={onLogin}>Log in</PromiseButton>
    </div>
    <div slot="footer-right">
        <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
    </div>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>