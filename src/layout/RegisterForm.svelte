<script lang="ts">
    import { InfoBar, TextBox, Button, ProgressRing } from "fluent-svelte";
    import { emailValidationRegex, passwordValidationRegex } from "../lib/validation";
    import { DialogForm } from "$layout";

    let formComponent;

    let email: String;
    let password: String;
    let confirmedPassword: String;
    $: isPasswordInvalid = !passwordValidationRegex.test(password);

    let promise: Promise<Response>;

    function onRegister() {
        if (!emailValidationRegex.test(email)) {
            formComponent.showCriticalMessage("Invalid e-mail address.");
            return;
        } else if (password != confirmedPassword) {
            formComponent.showCriticalMessage("Passwords don't match.");
            return;
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
                    formComponent.showSuccessMessage("Your account has been created successfully. Before logging in, please verify your e-mail by clicking the link that was sent to it.");
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
    }
</script>

<DialogForm title="Register" bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"></TextBox>
    <InfoBar bind:open={isPasswordInvalid} message="A password must consist of at least eight characters, including an uppercase letter, a digit and a special character." severity="caution" class="full-width" closable={false}/>
    <div slot="footer-left">
        {#if promise == null}
            <Button variant="accent" on:click={onRegister}>Register</Button>
        {:else}
            {#await promise}
                <ProgressRing size={28}/>
            {/await}
        {/if}
    </div>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>