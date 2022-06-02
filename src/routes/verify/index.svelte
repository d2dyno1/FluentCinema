<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { EmailVerification } from "$api/EmailVerification";

    let token;

    export const load: Load = async ({ fetch, session, url }) => {
        if (!session.isLoggedIn || session.user?.isVerified) {
            return {
                status: 302,
                redirect: "/"
            }
        }
        let token = decodeURIComponent(url.searchParams.get("token")!);
        let success = await EmailVerification.verifyEmail(fetch, token);
        return {
            status: 200,
            props: { success }
        };
    }
</script>

<script lang="ts">
    import { Button, ContentDialog, TextBlock } from "fluent-svelte";

    export let success: boolean;
</script>

<ContentDialog open={true} title={success ? "Success" : "Error"} closable={false}>
    <TextBlock>
        {#if success}
            Your e-mail address has been verified successfully. You may now close this tab or return to the home page.
        {:else}
            Invalid or expired token.
        {/if}
    </TextBlock>
    <Button slot="footer" variant="accent" on:click={() => window.location.reload()}>Home</Button>
</ContentDialog>