<script lang="ts">
    import { ActionBlock, PromiseButton } from "$lib";
    import { ValidatedTextBox } from "$lib";
    import MailIcon from "@fluentui/svg-icons/icons/password_24_filled.svg?raw";
    import { Button, ContentDialog, InfoBar } from "fluent-svelte";
    import { Account } from "$api/Account";
    import { passwordSchema } from "$api/validation";
    import { string } from "yup";

    let showDialog = false;
    let password: string;
    let isPasswordValid = false;
    let isConfirmedPasswordValid = false;

    let errorMessage: string;
    let success: boolean;

    async function changePassword(): Promise<void> {
        try {
            await Account.changePassword(password);
            success = true;
            password = "";
        } catch (e) {
            errorMessage = e;
            throw e;
        }
    }
</script>

<ActionBlock title="Password" description="Change your password." icon={MailIcon}>
    <Button slot="action" on:click={() => { success = false; showDialog = true }}>Change</Button>
</ActionBlock>

<ContentDialog title="Change password" bind:open={showDialog}>
    <div class="dialog">
        {#if success}
            <InfoBar message={"Your password has been changed successfully"} title="Success" severity="success" closable={false}/>
        {:else}
            <InfoBar message={errorMessage} severity="critical" open={errorMessage != null}/>
            <ValidatedTextBox type="password" placeholder="Password" validator={passwordSchema} bind:value={password} bind:isValid={isPasswordValid}/>
            <ValidatedTextBox type="password" placeholder="Confirm password" validator={string().equals([password], "Passwords don't match.")} bind:isValid={isConfirmedPasswordValid}/>
        {/if}
    </div>
    <svelte:fragment slot="footer">
        {#if success}
            <Button variant="accent" on:click={() => showDialog = false}>Close</Button>
        {:else}
            <PromiseButton disabled={!isPasswordValid || !isConfirmedPasswordValid} variant="accent" onClick={changePassword}>Change</PromiseButton>
            <Button on:click={() => showDialog = false}>Cancel</Button>
        {/if}
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "ChangePassword";
</style>