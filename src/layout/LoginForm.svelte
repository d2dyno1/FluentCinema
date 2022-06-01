<script lang="ts">
    import type { LoginSchema } from "$data/schema/LoginSchema";
    import type { LoginResponse } from "$data/response/LoginResponse";
    import { TextBlock } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton, ValidatedTextBox } from "$lib";
    import { InfoBarSeverity } from "$data/InfoBarSeverity";
    import { Account } from "$api/Account";
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

    let formComponent: any;

    let isOtpRequired = false;
    let promise: Promise<LoginResponse>;

    async function onLogin() {
        promise = Account.login(params);
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

    async function handleKeyboardEvent(event: KeyboardEvent | CustomEvent, value: string, isValid: boolean, validator: any) {
        const { key } = <KeyboardEvent>event;
        event.stopPropagation();
        
        if (isValid && key == "Enter") {
            event.preventDefault();
            try {
                await validator.validate(value)
                await onLogin();
            }
            catch (ex) {
                return;
            }
        }
    }
</script>

<DialogForm title="Log in" bind:this={formComponent}>
    {#if !isOtpRequired}
        <ValidatedTextBox type="email" placeholder="E-mail" validator={emailSchema} bind:value={email} bind:isValid={isEmailValid}/>
        <ValidatedTextBox type="password" placeholder="Password" validator={passwordSchema} bind:value={password} bind:isValid={isPasswordValid} on:keydown={e => handleKeyboardEvent(e, password, isPasswordValid, passwordSchema)}/>
        <slot/>
    {:else}
        <ValidatedTextBox type="password" placeholder="One-time password" validator={otpSchema} bind:value={otp} bind:isValid={isOtpValid} on:keydown={e => handleKeyboardEvent(e, otp, isOtpValid, otpSchema)}/>
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