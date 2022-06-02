<script lang="ts">
    import { Account } from "$api/Account";
    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import { ActionBlock, PromiseButton } from "$lib";
    import { accountSession } from "$/stores";

    let changePicturePromise: Promise<void>;
    let uploadFiles: HTMLInputElement;

    async function uploadPicture(): Promise<void> {
        return Account.uploadProfilePicture(uploadFiles.files[0]).then(() => window.location.reload());
    }

    async function deletePicture(): Promise<void> {
        return Account.uploadProfilePicture(null).then(() => {
            window.location.reload();
        });
    }
</script>

<ActionBlock title="Account picture" description="Update or remove your profile picture." icon={ProfileIcon}>
    <div class="account-picture-options" slot="action">
        {#if $accountSession.user?.hasCustomProfilePicture}
            <PromiseButton keepDisabledAfterResolve={true} onClick={deletePicture}>Remove</PromiseButton>
        {/if}
        <input on:change={() => changePicturePromise = uploadPicture()} type="file" class="select-file" bind:this={uploadFiles} accept=".jpg, .jpeg, .png, .svg">
        <PromiseButton promise={changePicturePromise} keepDisabledAfterResolve={true} on:click={() => uploadFiles.click()}>Change</PromiseButton>
    </div>
</ActionBlock>

<style lang="scss">
    @use "ProfilePicture";
</style>