<script lang="ts">
    import { TextBlock } from "fluent-svelte";

    export let isClickableEffect: boolean;
    export let title: string;
    export let description: string;
</script>

<div class="action-block" on:click class:isClickableEffect>
    <div class="icon">
        <slot name="icon"/>
    </div>
    <div class="column">
        <TextBlock>{title}</TextBlock>
        <TextBlock variant="caption" class="description-section">{description}</TextBlock>
    </div>
    <div class="align-right">
        <slot name="action"/>
    </div>
</div>

<style lang="scss">
    @use "ActionBlock";
</style>