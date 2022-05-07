<script lang="ts">
    import { InfoBar, TextBox } from "fluent-svelte";
    import { emailValidationRegex, passwordValidationRegex } from "$lib/validation";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import { _ } from "$lib/i18n/i18n";

    let formComponent;

    let email: string;
    let password: string;
    let confirmedPassword: string;
    $: isPasswordInvalid = !passwordValidationRegex.test(password);

    let promise: Promise<Response>;

    function onRegister() {
        if (!emailValidationRegex.test(email)) {
            formComponent.showCriticalMessage($_("general.error.email.invalid"));
            return;
        } else if (password != confirmedPassword) {
            formComponent.showCriticalMessage($_("general.error.password.different"));
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
                    formComponent.showSuccessMessage($_("form.register.successMessage"));
                } else {
                    formComponent.showCriticalMessage($_(response.message));
                }
            });
            promise.catch(err => formComponent.showCriticalMessage(err.message));
        }
    }
</script>

<DialogForm title={$_("form.register.title")} bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder={$_("general.email")}/>
    <TextBox bind:value={password} type="password" placeholder={$_("general.password")}/>
    <TextBox bind:value={confirmedPassword} type="password" placeholder={$_("general.confirmPassword")}/>
    <InfoBar bind:open={isPasswordInvalid} message={$_("form.register.passwordRequirementsWarning")} severity="caution" class="full-width" closable={false}/>
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onRegister}>{$_("form.register.actionButton")}</PromiseButton>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>