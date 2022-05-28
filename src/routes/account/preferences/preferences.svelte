<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button, ContentDialog, TextBlock, ToggleSwitch } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";
    import DeleteIcon from "@fluentui/svg-icons/icons/delete_48_filled.svg?raw";
    import PersonDeleteIcon from "@fluentui/svg-icons/icons/person_delete_24_filled.svg?raw";

    import { AccountApiContext } from "$api/AccountApiContext";
    import { SettingsApiContext } from "$api/SettingsApiContext";
    import { PromiseButton } from "$lib";

    let changePicturePromise: Promise<void>;
    let removePicturePromise: Promise<void>;
    let deleteAccountPromise: Promise<void>;
    let invalidateSessionsPromise: Promise<void>;

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

    async function uploadPicture() {
        changePicturePromise = AccountApiContext.uploadProfilePicture(uploadFiles.files[0]);
        await changePicturePromise;
        window.location.reload();
    }

    async function deletePicture() {
        removePicturePromise = AccountApiContext.uploadProfilePicture(null);
        await removePicturePromise;
        window.location.reload();
    }

    async function deleteAccount() {
        deleteAccountPromise = AccountApiContext.delete();
        await deleteAccountPromise;
        window.location.reload();
    }

    async function invalidateSessions() {
        invalidateSessionsPromise = AccountApiContext.invalidateOtherSessions();
    }
</script>

<div class="settings-list">
    <ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
        <div class="account-picture-options" slot="action">
            {#if $accountSession.user?.hasCustomProfilePicture}
                <PromiseButton promise={removePicturePromise} keepDisabledAfterResolve={true} on:click={deletePicture}>Remove</PromiseButton>
            {/if}
            <input on:change={uploadPicture} type="file" class="select-file" bind:this={uploadFiles} accept=".jpg, .jpeg, .png, .svg">
            <PromiseButton promise={changePicturePromise} keepDisabledAfterResolve={true} on:click={() => uploadFiles.click()}>Change</PromiseButton>
        </div>
    </ActionBlock>
    <TextBlock>Security</TextBlock>
    <ActionBlock title="Invalidate sessions" description="Invalidate all sessions except this one." icon={DeleteIcon}>
        <PromiseButton slot="action" promise={invalidateSessionsPromise} on:click={invalidateSessions}>Invalidate</PromiseButton>
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
        <PromiseButton variant="accent" promise={deleteAccountPromise} keepDisabledAfterResolve={true} on:click={deleteAccount}>Yes</PromiseButton>
        <Button on:click={() => showAccountDeletionConfirmationDialog = false}>Cancel</Button>
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "preferences";
</style>