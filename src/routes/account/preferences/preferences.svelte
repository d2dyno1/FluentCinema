<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button, ContentDialog, ToggleSwitch } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";
    import DeleteIcon from "@fluentui/svg-icons/icons/delete_48_filled.svg?raw";
    import { AccountApiContext } from "../../../api/AccountApiContext";
    import { SettingsApiContext } from "../../../api/SettingsApiContext";

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
        await AccountApiContext.uploadProfilePicture(uploadFiles.files[0]);
        window.location.reload();
    }

    async function deletePicture() {
        await AccountApiContext.uploadProfilePicture(null);
        window.location.reload();
    }

    async function deleteAccount() {
        await AccountApiContext.delete();
        window.location.reload();
    }
</script>

<div class="settings-list">
    <ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
        <div class="account-picture-options" slot="action">
            {#if $accountSession.user?.hasCustomProfilePicture}
                <Button on:click={deletePicture}>Remove</Button>
            {/if}
            <input on:change={uploadPicture} type="file" class="select-file" bind:this={uploadFiles} accept=".jpg, .jpeg, .png, .svg">
            <Button on:click={() => uploadFiles.click()}>Change</Button>
        </div>
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
    <ActionBlock title="Delete account" description="Delete your account and any data associated with it. Your reservations will not be refunded." icon={DeleteIcon}>
        <Button slot="action" on:click={() => showAccountDeletionConfirmationDialog = true}>Delete</Button>
    </ActionBlock>
</div>
<ContentDialog title="Delete account" bind:open={showAccountDeletionConfirmationDialog}>
    Are you sure? This action cannot be undone!
    <svelte:fragment slot="footer">
        <Button slot="footer" variant="accent" on:click={deleteAccount}>Yes</Button>
        <Button slot="footer" on:click={() => showAccountDeletionConfirmationDialog = false}>Cancel</Button>
    </svelte:fragment>
</ContentDialog>

<style lang="scss">
    @use "preferences";
</style>