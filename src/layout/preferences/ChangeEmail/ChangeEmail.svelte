<script lang="ts">
    import { ActionBlock, PromiseButton } from "$lib";
    import { ValidatedTextBox } from "$lib";
    import MailIcon from "@fluentui/svg-icons/icons/mail_48_filled.svg?raw";
    import { emailSchema as _emailSchema } from "$api/validation";
    import { accountSession } from "$/stores";
    import { Button, ContentDialog, InfoBar } from "fluent-svelte";
    import { Account } from "$api/Account";

    const emailSchema = _emailSchema.notOneOf([$accountSession.user.email], "Your new e-mail address cannot be the same as your current one.");

    let showDialog = false;
    let email: string;
    let isEmailValid = false;

    let errorMessage: string;

    async function changeEmail(): Promise<void> {
        try {
            await Account.changeEmailAddress(email);
            window.location.reload();
        } catch (e) {
            errorMessage = e;
            throw e;
        }
    }
</script>

<ActionBlock title="E-mail" description="Change your e-mail address." icon={MailIcon}>
    <Button slot="action" on:click={() => showDialog = true}>Change</Button>
</ActionBlock>

<ContentDialog title="Change e-mail address" bind:open={showDialog}>
    <div class="dialog">
        <InfoBar message={errorMessage} severity="critical" open={errorMessage != null}/>
        <ValidatedTextBox type="email" placeholder="New e-mail" validator={emailSchema} bind:value={email} bind:isValid={isEmailValid}></ValidatedTextBox>
    </div>
    <svelte:fragment slot="footer">
        <PromiseButton disabled={!isEmailValid} variant="accent" keepDisabledAfterResolve={true} onClick={changeEmail} slot="footer-left">Change</PromiseButton>
        <Button on:click={() => showDialog = false}>Cancel</Button>
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "ChangeEmail";
</style>