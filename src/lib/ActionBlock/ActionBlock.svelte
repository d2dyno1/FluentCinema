<script lang="ts">
    import { TextBlock } from "fluent-svelte";

    export let isClickable: boolean;
    export let title: string;
    export let description: string;
    export let actionElement: any;
</script>

<div class="action-block" on:click class:isClickable={isClickable}>
    <div class="icon">
        <slot name="icon"/>
    </div>
    <div class="column">
        <TextBlock variant="bodyStrong">{title}</TextBlock>
        <TextBlock>{description}</TextBlock>
    </div>
    <div class="align-right">
        <slot name="action"/>
        {#if actionElement}
            {@html actionElement}
        {/if}
    </div>
</div>

<style lang="scss">
    @use "ActionBlock";
</style>