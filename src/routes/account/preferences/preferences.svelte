<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button, ContentDialog, InfoBar, TextBlock, ToggleSwitch } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";
    import DeleteIcon from "@fluentui/svg-icons/icons/delete_48_filled.svg?raw";
    import PersonDeleteIcon from "@fluentui/svg-icons/icons/person_delete_24_filled.svg?raw";

    import { AccountApiContext } from "$api/AccountApiContext";
    import { SettingsApiContext } from "$api/SettingsApiContext";
    import { PromiseButton } from "$lib";
    import { EmailVerificationApiContext } from "$api/EmailVerificationApiContext";

    let changePicturePromise: Promise<void>;

    let showAccountDeletionConfirmationDialog: boolean;
    let uploadFiles: HTMLInputElement;

    async function uploadSettings(): Promise<void>
    {
        await SettingsApiContext.update($accountSession.user.settings);
    }

    function updateAndUploadSettings(newValue: any, updateSettingCallback: (newValue: any) => void)
    {
        updateSettingCallback(newValue);
        uploadSettings();
    }

    async function resendVerificationEmail(): Promise<void> {
        return EmailVerificationApiContext.beginVerification();
    }

    async function uploadPicture(): Promise<void> {
        return AccountApiContext.uploadProfilePicture(uploadFiles.files[0]).then(() => window.location.reload());
    }

    async function deletePicture(): Promise<void> {
        return AccountApiContext.uploadProfilePicture(null).then(() => {
            window.location.reload();
        });
    }

    async function deleteAccount(): Promise<void> {
        return AccountApiContext.delete().then(() => {
            window.location.reload();
        });
    }

    async function invalidateSessions(): Promise<void> {
        return AccountApiContext.invalidateOtherSessions();
    }
</script>

{#if !$accountSession.user.isVerified}
    <InfoBar title="Unverified e-mail address" message="In order to verify your e-mail address, follow the instructions within the e-mail that was sent. If you can't find it even after checking the spam folder, press the button below." severity="caution" closable={false}>
        <PromiseButton slot="action" onClick={resendVerificationEmail}>Resend verification e-mail</PromiseButton>
    </InfoBar>
{/if}
<div class="settings-list">
    <ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
        <div class="account-picture-options" slot="action">
            {#if $accountSession.user?.hasCustomProfilePicture}
                <PromiseButton keepDisabledAfterResolve={true} onClick={deletePicture}>Remove</PromiseButton>
            {/if}
            <input on:change={() => changePicturePromise = uploadPicture()} type="file" class="select-file" bind:this={uploadFiles} accept=".jpg, .jpeg, .png, .svg">
            <PromiseButton promise={changePicturePromise} keepDisabledAfterResolve={true} on:click={() => uploadFiles.click()}>Change</PromiseButton>
        </div>
    </ActionBlock>
    <TextBlock>Security</TextBlock>
    <ActionBlock title="Invalidate sessions" description="Invalidate all sessions except this one." icon={DeleteIcon}>
        <PromiseButton slot="action" onClick={invalidateSessions}>Invalidate</PromiseButton>
    </ActionBlock>
    <ActionBlock title="Two-factor authentication" description="You will need to enter a 6-digit code sent to your e-mail every time you log in." icon={KeyIcon}>
        <ToggleSwitch
                bind:checked={$accountSession.user.settings.twoFactorAuthentication}
                on:click={(e) => updateAndUploadSettings(e.target.checked, (x) => $accountSession.user.settings.twoFactorAuthentication = x)}
                slot="action">
            {#if $accountSession.user?.settings.twoFactorAuthentication}
                On
            {:else}
                Off
            {/if}
        </ToggleSwitch>
    </ActionBlock>
    <TextBlock>Other</TextBlock>
    <ActionBlock title="Delete account" description="Delete your account and any data associated with it. Your reservations will not be refunded." icon={PersonDeleteIcon}>
        <Button slot="action" on:click={() => showAccountDeletionConfirmationDialog = true}>Delete</Button>
    </ActionBlock>
</div>
<ContentDialog title="Delete account" bind:open={showAccountDeletionConfirmationDialog}>
    Are you sure? This action cannot be undone!
    <svelte:fragment slot="footer">
        <PromiseButton variant="accent" keepDisabledAfterResolve={true} onClick={deleteAccount}>Yes</PromiseButton>
        <Button on:click={() => showAccountDeletionConfirmationDialog = false}>Cancel</Button>
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "preferences";
</style>