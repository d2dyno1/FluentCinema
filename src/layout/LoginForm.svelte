<script lang="ts">
    import { TextBox, TextBlock } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import { loginSchema } from "$data/schema/LoginSchema";
    import type { LoginSchema } from "$data/schema/LoginSchema";
    import { InfoBarSeverity } from "$data/InfoBarSeverity";
    import type { LoginResponse } from "$data/response/LoginResponse";
    import { AccountApiContext } from "../api/AccountApiContext";

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
        try {
            await loginSchema.validate(params);
        } catch (e) {
            formComponent.showMessage(e.message, InfoBarSeverity.critical);
            return;
        }

        promise = AccountApiContext.login(params);
        promise.then(response => {
            if (response.otpRequired) {
                isOtpRequired = true;
                formComponent.showMessage("Two-factor authentication is enabled. A one-time password has been sent to your e-mail.", InfoBarSeverity.attention);
                return;
            } else if (response.success) {
                window.location.reload();
            } else {
                formComponent.showMessage(response.message, InfoBarSeverity.critical);
            }
        });
        promise.catch(err => formComponent.showMessage(err.message, InfoBarSeverity.critical));
    }
</script>

<DialogForm title="Log in" bind:this={formComponent}>
    {#if !isOtpRequired}
        <TextBox bind:value={email} type="email" placeholder="E-mail"/>
        <TextBox bind:value={password} type="password" placeholder="Password"/>
        <slot/>
    {:else}
        <TextBox bind:value={otp} placeholder="One-time password"/>
    {/if}
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onLogin}>Log in</PromiseButton>
    <svelte:fragment slot="footer-right">
        {#if !isOtpRequired}
            <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
        {/if}
    </svelte:fragment>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>