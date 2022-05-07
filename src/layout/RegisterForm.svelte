<script lang="ts">
    import { InfoBar, TextBox } from "fluent-svelte";
    import {emailValidationRegex, passwordValidationRegex, usernameValidationRegex} from "$lib/validation";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";

    let formComponent;

    let username: string;
    let email: string;
    let password: string;
    let confirmedPassword: string;
    $: isUsernameValid = usernameValidationRegex.test(username);
    $: isPasswordInvalid = !passwordValidationRegex.test(password);

    let promise: Promise<Response>;

    function onRegister() {
        if (!isUsernameValid) {
            formComponent.showCriticalMessage("A username must be between 2 and 16 characters long and can only consist of letters, digits and underscores.");
            return;
        } else if (!emailValidationRegex.test(email)) {
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
                    username: username,
                    email: email,
                    password: password
                })
            });
            promise.then(response => response.json()).then(response => {
                if (!response.success) {
                    formComponent.showCriticalMessage(response.message);
                }
            });
            promise.catch(err => formComponent.showCriticalMessage(err.message));
        }
    }
</script>

<DialogForm title="Register" bind:this={formComponent}>
    <TextBox bind:value={username} placeholder="Username"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"/>
    <TextBox bind:value={password} type="password" placeholder="Password"/>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"/>
    <InfoBar bind:open={isPasswordInvalid} message="A password must consist of at least eight characters, including an uppercase letter, a digit and a special character." severity="caution" class="full-width" closable={false}/>
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onRegister}>Register</PromiseButton>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>