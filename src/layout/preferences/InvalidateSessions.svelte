<script lang="ts">
    import { ActionBlock, PromiseButton } from "$lib";
    import { Account } from "$api/Account";
    import DeleteIcon from "@fluentui/svg-icons/icons/delete_48_filled.svg?raw";

    async function invalidateSessions(): Promise<void> {
        return Account.invalidateOtherSessions();
    }
</script>

<ActionBlock title="Invalidate sessions" description="Invalidate all sessions except this one." icon={DeleteIcon}>
    <PromiseButton slot="action" onClick={invalidateSessions}>Invalidate</PromiseButton>
</ActionBlock>