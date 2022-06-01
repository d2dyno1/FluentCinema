<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { ok } from "$api/responses";
    import { ResetPassword } from "$api/ResetPassword";

    export const load: Load = async ({ fetch, url, session }) => {
        if (session.isLoggedIn) {
            return {
                status: 302,
                redirect: "/"
            };
        }
        let token = url.searchParams.has("token") ? decodeURIComponent(url.searchParams.get("token")) : null;
        if (token != null) {
            return {
                status: 200,
                props: {
                    token: token,
                    isTokenValid: await ResetPassword.isTokenValid(fetch, token)
                }
            };
        }
        return ok;
    }
</script>

<script lang="ts">
    import { Button, ContentDialog, InfoBar, TextBlock } from "fluent-svelte";
    import { PromiseButton } from "$lib";
    import type { ResetPasswordResponse } from "$data/response/ResetPasswordResponse";
    import { emailSchema } from "$api/validation";
    import { ValidatedTextBox } from "$lib";
    import { passwordSchema } from "$api/validation.js";
    import { string } from "yup";
    import { goto } from "$app/navigation";

    export let token: string | null;
    export let isTokenValid: boolean;

    let email: string;
    let isEmailValid: boolean;
    let password: string;

    let isPasswordValid: boolean;
    let isConfirmedPasswordValid: boolean;

    let promise: Promise<Response>;

    let beginProcessResponse: ResetPasswordResponse;
    let beginProcessPromise: Promise<ResetPasswordResponse>;

    let resetPasswordResponse: ResetPasswordResponse;
    let resetPasswordPromise: Promise<ResetPasswordResponse>;

    let isError: boolean = false;
    let errorMessage;

    async function beginProcess() {
        isError = false;
        beginProcessPromise = ResetPassword.beginPasswordResetProcess(fetch, email);
        beginProcessResponse = await beginProcessPromise;
        if (!beginProcessResponse.success && beginProcessResponse.message != null) {
            isError = true;
            errorMessage = beginProcessResponse.message;
            beginProcessResponse = beginProcessPromise = null;
        }
    }

    async function changePassword() {
        isError = false;
        resetPasswordPromise = ResetPassword.changePassword(fetch, token, password);
        resetPasswordResponse = await resetPasswordPromise;
    }
</script>

<ContentDialog open={true} closable={false} title="Reset password">
    <div class="reset-password">
        <InfoBar bind:open={isError} bind:message={errorMessage} severity="critical"/>
        {#if token == null}
            {#if beginProcessResponse == null}
                <ValidatedTextBox type="email" placeholder="E-mail" validator={emailSchema} bind:value={email} bind:isValid={isEmailValid}/>
            {:else if beginProcessResponse.success}
                <InfoBar open={true} severity="success" message="Please follow the instructions sent to the specified e-mail address." closable={false}/>
            {/if}
        {:else}
            {#if isTokenValid}
                {#if resetPasswordResponse == null}
                    <ValidatedTextBox type="password" placeholder="Password" validator={passwordSchema} bind:value={password} bind:isValid={isPasswordValid}></ValidatedTextBox>
                    <ValidatedTextBox type="password" placeholder="Confirm password" validator={string().equals([password], "Passwords don't match.")} bind:isValid={isConfirmedPasswordValid}></ValidatedTextBox>
                {:else}
                    <InfoBar open={true} severity="success" message="Your password has been reset successfully. You can now log in again." closable={false}/>
                {/if}
            {:else}
                <InfoBar open={true} closable={false} message="Invalid or expired token." severity="critical"/>
            {/if}
        {/if}
    </div>
    <svelte:fragment slot="footer">
        {#if token == null && (beginProcessResponse == null || !beginProcessResponse.success)}
            <PromiseButton variant="accent" disabled={!isEmailValid} promise={beginProcessPromise} on:click={beginProcess}>Reset password</PromiseButton>
        {:else if isTokenValid}
            {#if resetPasswordResponse == null}
                <PromiseButton variant="accent" disabled={!isPasswordValid || !isConfirmedPasswordValid} promise={resetPasswordPromise} on:click={changePassword}>Reset password</PromiseButton>
            {:else}
                <Button variant="accent" on:click={() => goto("/")}>Home</Button>
            {/if}
        {/if}
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "resetpassword";
</style>