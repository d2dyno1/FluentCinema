<script lang="ts">
    import { TextBlock } from "fluent-svelte";

    export let number: number;
    export let reserved: boolean = false;
    export let selected: boolean = false;

    let className = "";
    export { className as class };
</script>

<div class="seat {className}" class:reserved class:selected>
    {#if number != null}
        <div class="number">
            <TextBlock variant="body">{number}</TextBlock>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "Seat";
</style>