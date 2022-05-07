<script lang="ts">
    import { TextBox, TextBlock } from "fluent-svelte";
    import { emailValidationRegex } from "$lib/validation";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import { _ } from "$lib/i18n/i18n";

    let email: string;
    let password: string;

    let formComponent;
    let promise: Promise<Response>;

    function onLogin() {
        if (!emailValidationRegex.test(email)) {
            formComponent.showCriticalMessage($_("general.error.email.invalid"));
            return;
        } else if (password.length == 0) {
            formComponent.showCriticalMessage($_("general.error.password.empty"));
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
                formComponent.showSuccessMessage($_("form.login.successMessage"));
            } else {
                formComponent.showCriticalMessage($_(response.message));
            }
        });
        promise.catch(err => formComponent.showCriticalMessage(err.message));
    }
</script>

<DialogForm title={$_("form.login.title")} bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder={$_("general.email")}/>
    <TextBox bind:value={password} type="password" placeholder={$_("general.password")}/>
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onLogin}>{$_("form.login.actionButton")}</PromiseButton>
    <TextBlock slot="footer-right"><a href="/resetpassword">{$_("form.login.passwordReset")}</a></TextBlock>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>