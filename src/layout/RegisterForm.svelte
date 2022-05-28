<script lang="ts">
    import { DialogForm } from "$layout";
    import { PromiseButton } from "$lib";
    import type { RegisterSchema } from "$data/schema/RegisterSchema";
    import { InfoBarSeverity } from "$data/InfoBarSeverity";
    import type { GeneralResponse } from "$data/response/GeneralResponse";
    import { AccountApiContext } from "$api/AccountApiContext";
    import { emailSchema, passwordSchema, usernameSchema } from "$api/validation.js";
    import { string } from "yup";
    import ValidatedTextBox from "$lib/ValidatedTextBox/ValidatedTextBox.svelte";

    let formComponent;

    let isUsernameValid = false;
    let isEmailValid = false;
    let isPasswordValid = false;
    let isConfirmedPasswordValid = false;

    let username: string;
    let email: string;
    let password: string;
    $: params = {
        username: username,
        email: email,
        password: password
    } as RegisterSchema;

    async function onRegister(): Promise<GeneralResponse> {
        let promise = AccountApiContext.register(params);
        try {
            let response = await promise;
            if (response.success) {
                window.location.replace("/account");
            } else {
                formComponent.showMessage(response.message, InfoBarSeverity.critical);
            }
        } catch (e) {
            formComponent.showMessage(e, InfoBarSeverity.critical);
        }
        return promise;
    }
</script>

<DialogForm title="Register" bind:this={formComponent}>
    <ValidatedTextBox placeholder="Username" validator={usernameSchema} bind:value={username} bind:isValid={isUsernameValid}></ValidatedTextBox>
    <ValidatedTextBox type="email" placeholder="E-mail" validator={emailSchema} bind:value={email} bind:isValid={isEmailValid}></ValidatedTextBox>
    <ValidatedTextBox type="password" placeholder="Password" validator={passwordSchema} bind:value={password} bind:isValid={isPasswordValid}></ValidatedTextBox>
    <ValidatedTextBox type="password" placeholder="Confirm password" validator={string().equals([password], "Passwords don't match.")} bind:isValid={isConfirmedPasswordValid}></ValidatedTextBox>
    <PromiseButton
            disabled={!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmedPasswordValid}
            variant="accent" keepDisabledAfterResolve={true} slot="footer-left" onClick={onRegister}>Register</PromiseButton>
    <slot/>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>