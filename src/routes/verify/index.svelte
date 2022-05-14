<script lang="ts" context="module">
    import {ok} from "$api/responses";
    import type {Load} from "@sveltejs/kit";

    export let token;

    export const load: Load = async ({ url }) => {
        token = decodeURIComponent(url.searchParams.get("token"));
        return ok;
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    let promise: Promise<string>

    onMount(() => {
        promise = fetch("/api/account/email/verify", {
            headers: {
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify({ token: token })
        }).then(response => response.json()).then(response => {
            if (response.success) {
                return "Your e-mail address has been verified successfully.";
            } else {
                return "Invalid token.";
            }
        });
    });
</script>

{#await promise then value}
    <p>{value}</p>
{/await}