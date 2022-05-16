<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button, ToggleSwitch } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";

    let uploadFiles: HTMLInputElement;

    function uploadSettings(): void
    {
        fetch("/api/account/settings/update", {
            method: "PUT",
            body: JSON.stringify($accountSession.user.settings)
        });
    }

    function updateAndUploadSettings(newValue: any, updateSettingCallback: (newValue: any) => void): void
    {
        updateSettingCallback(newValue);
        uploadSettings();
    }

    function uploadPicture() {
        fetch("/api/account/picture/upload", {
            method: "PUT",
            body: uploadFiles.files[0]
        }).then(() => window.location.reload());
    }
</script>

<div class="settings-list">
    <ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
        <svelte:fragment slot="action">
            <input on:change={uploadPicture} type="file" class="select-file" bind:this={uploadFiles} accept=".jpg, .jpeg, .png, .svg">
            <Button on:click={() => uploadFiles.click()}>Change</Button>
        </svelte:fragment>
    </ActionBlock>
    <ActionBlock title="Two-factor authentication" description="You will need to enter a 6-digit code sent to your e-mail every time you log in." icon={KeyIcon}>
        <ToggleSwitch
            bind:checked={$accountSession.user.settings.twoFactorAuthentication}
            on:click={(e) => updateAndUploadSettings(e.target.checked, (x) => $accountSession.user.settings.twoFactorAuthentication = x)}
            slot="action">
                {#if $accountSession.user.settings.twoFactorAuthentication}
                    On
                {:else}
                    Off
                {/if}
            </ToggleSwitch>
    </ActionBlock>
</div>

<style lang="scss">
    @use "preferences";
</style>