<script lang="ts">
    import {PersonPicture} from "fluent-svelte";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import {onMount} from "svelte";
    import {AccountApiContext} from "../../api/AccountApiContext";

    export let userId: string;
    export let size: number;

    let base64: Promise<string | null>;

    onMount(async () => {
        base64 = AccountApiContext.getProfilePicture(userId);
    });
</script>

<PersonPicture size={size}>
    {#if base64 != null}
        {#await base64 then value}
            {#if value == null}
                {@html ProfileIcon}
            {:else}
                <img style="height: {size}px; width: {size}px;" class="user-picture" alt=" " src={`data:image/png;base64,${value}`}>
            {/if}
        {/await}
    {/if}
</PersonPicture>

<style lang="scss">
    @use "AccountPicture";
</style>