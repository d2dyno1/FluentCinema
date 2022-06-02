<script lang="ts">
    import { Account } from "$api/Account";
    import PersonDeleteIcon from "@fluentui/svg-icons/icons/person_delete_24_filled.svg?raw";
    import { ActionBlock, PromiseButton } from "$lib";
    import { Button, ContentDialog } from "fluent-svelte";

    let showDialog = false;

    async function deleteAccount(): Promise<void> {
        return Account.delete().then(() => {
            window.location.reload();
        });
    }
</script>


<ActionBlock title="Delete account" description="Delete your account and any data associated with it. Your reservations will not be refunded." icon={PersonDeleteIcon}>
    <Button slot="action" on:click={() => showDialog = true}>Delete</Button>
</ActionBlock>

<ContentDialog title="Delete account" bind:open={showDialog}>
    Are you sure? This action cannot be undone!
    <svelte:fragment slot="footer">
        <PromiseButton variant="accent" keepDisabledAfterResolve={true} onClick={deleteAccount}>Yes</PromiseButton>
        <Button on:click={() => showDialog = false}>Cancel</Button>
    </svelte:fragment>
</ContentDialog>