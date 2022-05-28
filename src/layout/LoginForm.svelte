<script lang="ts">
    import { TextBlock } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import type { LoginSchema } from "$data/schema/LoginSchema";
    import { InfoBarSeverity } from "$data/InfoBarSeverity";
    import type { LoginResponse } from "$data/response/LoginResponse";
    import { AccountApiContext } from "../api/AccountApiContext";
    import ValidatedTextBox from "$lib/ValidatedTextBox/ValidatedTextBox.svelte";
    import { emailSchema, passwordSchema, otpSchema } from "$api/validation";

    let isEmailValid = false;
    let isPasswordValid = false;
    let isOtpValid = false;

    let email: string;
    let password: string;
    let otp: string;
    $: params = {
        email: email,
        password: password,
        otp: otp
    } as LoginSchema;

    let formComponent;

    let isOtpRequired = false;
    let promise: Promise<LoginResponse>;

    async function onLogin() {
        promise = AccountApiContext.login(params);
        try {
            let response = await promise;
            if (response.otpRequired) {
                isOtpRequired = true;
                formComponent.showMessage("Two-factor authentication is enabled. A one-time password has been sent to your e-mail.", InfoBarSeverity.attention);
                promise = null;
                return;
            } else if (response.success) {
                window.location.reload();
            } else {
                formComponent.showMessage(response.message, InfoBarSeverity.critical);
            }
        } catch (e) {
            formComponent.showMessage(e, InfoBarSeverity.critical)
        }
    }
</script>

<DialogForm title="Log in" bind:this={formComponent}>
    {#if !isOtpRequired}
        <ValidatedTextBox type="email" placeholder="E-mail" validator={emailSchema} bind:value={email} bind:isValid={isEmailValid}></ValidatedTextBox>
        <ValidatedTextBox type="password" placeholder="Password" validator={passwordSchema} bind:value={password} bind:isValid={isPasswordValid}></ValidatedTextBox>
        <slot/>
    {:else}
        <ValidatedTextBox type="password" placeholder="One-time password" validator={otpSchema} bind:value={otp} bind:isValid={isOtpValid}></ValidatedTextBox>
    {/if}
    <PromiseButton disabled={!isEmailValid || !isPasswordValid || isOtpRequired != isOtpValid} variant="accent" keepDisabledAfterResolve={true} promise={promise} on:click={onLogin} slot="footer-left">Log in</PromiseButton>
    <svelte:fragment slot="footer-right">
        {#if !isOtpRequired}
            <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
        {/if}
    </svelte:fragment>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>