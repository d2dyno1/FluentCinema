<script lang="ts">
    import { ActionBlock } from "$lib";
    import { InfoBar, TextBlock, ToggleSwitch } from "fluent-svelte";
    import { accountSession } from "$/stores";
    import { Settings } from "$api/Settings";
    import { PromiseButton } from "$lib";
    import { EmailVerification } from "$api/EmailVerification";
    import ChangeEmail from "$layout/preferences/ChangeEmail/ChangeEmail.svelte";
    import DeleteAccount from "$layout/preferences/DeleteAccount.svelte";
    import KeyIcon from "@fluentui/svg-icons/icons/key_32_filled.svg?raw";
    import InvalidateSessions from "$layout/preferences/InvalidateSessions.svelte";
    import ProfilePicture from "$layout/preferences/ProfilePicture/ProfilePicture.svelte";

    async function uploadSettings(): Promise<void>
    {
        await Settings.update($accountSession.user.settings);
    }

    function updateAndUploadSettings(newValue: any, updateSettingCallback: (newValue: any) => void)
    {
        updateSettingCallback(newValue);
        uploadSettings();
    }

    async function resendVerificationEmail(): Promise<void> {
        return EmailVerification.beginVerification();
    }
</script>

{#if !$accountSession.user.isVerified}
    <InfoBar title="Unverified e-mail address" message="In order to verify your e-mail address, follow the instructions within the e-mail that was sent. If you can't find it even after checking the spam folder, press the button below." severity="caution" closable={false}>
        <PromiseButton slot="action" onClick={resendVerificationEmail}>Resend verification e-mail</PromiseButton>
    </InfoBar>
{/if}
<div class="settings-list">
    <ProfilePicture/>
    <ChangeEmail/>
    <TextBlock variant="bodyStrong">Security</TextBlock>
    <InvalidateSessions/>
    <ActionBlock title="Two-factor authentication" description="You will need to enter a 6-digit code sent to your e-mail every time you log in. Requires a verified e-mail address." icon={KeyIcon}>
        <ToggleSwitch
                bind:checked={$accountSession.user.settings.twoFactorAuthentication}
                on:click={(e) => updateAndUploadSettings(e.target.checked, (x) => $accountSession.user.settings.twoFactorAuthentication = x)}
                slot="action"
                disabled={!$accountSession.user.isVerified}>
            {#if $accountSession.user?.settings.twoFactorAuthentication}
                On
            {:else}
                Off
            {/if}
        </ToggleSwitch>
    </ActionBlock>
    <TextBlock variant="bodyStrong">Other</TextBlock>
    <DeleteAccount/>
</div>



<style lang="scss">
    @use "preferences";
</style>