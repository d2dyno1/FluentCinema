<script lang="ts">
    import { TextBlock } from "fluent-svelte";

    export let number: number;
    export let reserved: boolean;
    export let selected: boolean;
</script>

<div class="seat" class:reserved class:selected>
    {#if number != null}
        <div class="number">
            <TextBlock variant="body">{number}</TextBlock>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "Seat";
</style>