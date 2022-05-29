<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";

    let token;

    export const load: Load = async ({ session, url }) => {
        if (!session.isLoggedIn || session.user?.isVerified) {
            return {
                status: 302,
                redirect: "/"
            }
        }
        return {
            status: 200,
            props: {
                token: decodeURIComponent(url.searchParams.get("token"))
            }
        };
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { EmailVerification } from "src/api/EmailVerification";

    export let token: string;
    let promise: Promise<boolean>

    onMount(() => promise = EmailVerification.verifyEmail(token));
</script>

{#if promise != null}
    {#await promise then isSuccess}
        {#if isSuccess}
            <p>Your e-mail address has been verified successfully. You may now close this tab or return to the home page.</p>
        {:else}
            <p>Invalid token.</p>
        {/if}
    {/await}
{/if}