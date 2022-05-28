<script lang="ts">
    import { TextBox } from "fluent-svelte";
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import { registerSchema } from "$data/schema/RegisterSchema";
    import type { RegisterSchema } from "$data/schema/RegisterSchema";
    import { InfoBarSeverity } from "$data/InfoBarSeverity";
    import type { GeneralResponse } from "$data/response/GeneralResponse";
    import { AccountApiContext } from "../api/AccountApiContext";

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

    let promise: Promise<GeneralResponse>;

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

        promise = AccountApiContext.register(params);
        promise.then((response: GeneralResponse) => {
            if (response.success) {
                window.location.replace("/account");
            } else {
                formComponent.showMessage(response.message, InfoBarSeverity.critical);
            }
        });
        promise.catch(err => formComponent.showMessage(err, InfoBarSeverity.critical));
    }
</script>

<DialogForm title="Register" bind:this={formComponent}>
    <TextBox bind:value={username} placeholder="Username"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"/>
    <TextBox bind:value={password} type="password" placeholder="Password"/>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"/>
    <PromiseButton variant="accent" keepDisabledAfterResolve={true} slot="footer-left" bind:promise={promise} on:click={onRegister}>Register</PromiseButton>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>