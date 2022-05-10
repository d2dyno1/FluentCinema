<script lang="ts">
    import { TextBox, TextBlock } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import {loginSchema} from "../data/schema/LoginSchema";
    import type {LoginSchema} from "../data/schema/LoginSchema";

    let email: string;
    let password: string;
    $: params = {
        email: email,
        password: password
    } as LoginSchema;

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
            if (response.success) {
                window.location.reload();
            } else {
                formComponent.showCriticalMessage(response.message);
            }
        });
        promise.catch(err => formComponent.showCriticalMessage(err.message));
    }
</script>

<DialogForm title="Log in" bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder="E-mail"/>
    <TextBox bind:value={password} type="password" placeholder="Password"/>
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onLogin}>Log in</PromiseButton>
    <TextBlock slot="footer-right"><a href="/resetpassword">Forgot password?</a></TextBlock>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>