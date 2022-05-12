<script lang="ts">
    import { TextBox, TextBlock, InfoBar } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import {loginSchema} from "../data/schema/LoginSchema";
    import type {LoginSchema} from "../data/schema/LoginSchema";

    let email: string;
    let password: string;
    let otp: string;
    $: params = {
        email: email,
        password: password,
        otp: otp
    } as LoginSchema;

    let otpRequired = false;

    let formComponent;

    let promise: Promise<Response>;

    async function onLogin() {
        try {
            await loginSchema.validate(params);
        } catch (e) {
            formComponent.showCriticalMessage(e.message);
            return;
        }

        promise = fetch("/api/account/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(params)
        });
        promise.then(response => response.json()).then(response => {
            if (response.otpRequired) {
                otpRequired = true;
                formComponent.showAttentionMessage("Two-factor authentication is enabled. A one-time password has been sent to your e-mail.");
                return;
            } else if (response.success) {
                window.location.reload();
            } else {
                formComponent.showCriticalMessage(response.message);
            }
        });
        promise.catch(err => formComponent.showCriticalMessage(err.message));
    }
</script>

<DialogForm title="Log in" bind:this={formComponent}>
    {#if !otpRequired}
        <TextBox bind:value={email} type="email" placeholder="E-mail"/>
        <TextBox bind:value={password} type="password" placeholder="Password"/>
        <slot/>
    {:else}
        <TextBox bind:value={otp} placeholder="One-time password"/>
    {/if}
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onLogin}>Log in</PromiseButton>
    <svelte:fragment slot="footer-right">
        {#if !otpRequired}
            <TextBlock><a href="/resetpassword">Forgot password?</a></TextBlock>
        {/if}
    </svelte:fragment>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>