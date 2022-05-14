<script lang="ts">
    import {TextBox} from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import {registerSchema} from "$data/schema/RegisterSchema";
    import type {RegisterSchema} from "$data/schema/RegisterSchema";
    import {InfoBarSeverity} from "../data/InfoBarSeverity";
    import type {GeneralResponse} from "../data/response/GeneralResponse";

    let formComponent;

    let username: string;
    let email: string;
    let password: string;
    let confirmedPassword: string;
    $: params = {
        username: username,
        email: email,
        password: password
    } as RegisterSchema;

    let promise: Promise<Response>;

    async function onRegister() {
        try {
            await registerSchema.validate(params);
        } catch (e) {
            formComponent.showMessage(e.message, InfoBarSeverity.critical);
            return;
        }
        if (password != confirmedPassword) {
            formComponent.showMessage("Passwords don't match.", InfoBarSeverity.critical);
            return;
        }

        promise = fetch("/api/account/register", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(params)
        });
        promise.then(response => response.json()).then((response: GeneralResponse) => {
            if (response.success) {
                window.location.replace("/settings");
            } else {
                formComponent.showMessage(response.message, InfoBarSeverity.critical);
            }
        });
        promise.catch(err => formComponent.showMessage(err.message, InfoBarSeverity.critical));
    }
</script>

<DialogForm title="Register" bind:this={formComponent}>
    <TextBox bind:value={username} placeholder="Username"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"/>
    <TextBox bind:value={password} type="password" placeholder="Password"/>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"/>
    <PromiseButton slot="footer-left" bind:promise={promise} on:click={onRegister}>Register</PromiseButton>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>