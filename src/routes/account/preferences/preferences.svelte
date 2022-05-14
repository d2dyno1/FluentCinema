<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button, Checkbox } from "fluent-svelte";
    import { accountSession } from "$/stores";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";

    function uploadSettings() {
        fetch("/api/account/settings/update", {
            method: "PUT",
            body: JSON.stringify($accountSession.user.settings)
        });
    }

    let files: HTMLInputElement;
    function uploadPicture() {
        fetch("/api/account/picture/upload", {
            method: "PUT",
            body: files.files[0]
        }).then(() => window.location.reload());
    }
</script>

<div class="settings-list">
    <ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
        <svelte:fragment slot="action">
            <input bind:this={files} type="file" accept=".jpg, .jpeg, .png, .svg">
            <Button on:click={uploadPicture}>Upload</Button>
        </svelte:fragment>
    </ActionBlock>
    <ActionBlock title="Two-factor authentication" description="You will need to enter a 6-digit code sent to your e-mail every time you log in." icon={KeyIcon}>
        <Checkbox slot="action" bind:checked={$accountSession.user.settings.twoFactorAuthentication}/>
    </ActionBlock>
<!--  TODO save settings automatically  -->
    <Button on:click={uploadSettings}>Save settings</Button>
</div>

<style lang="scss">
    @use "preferences";
</style>