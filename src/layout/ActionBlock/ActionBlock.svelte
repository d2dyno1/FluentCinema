<script lang="ts">
    import {TextBlock} from "fluent-svelte";

    export let title: string;
    export let description: string;
    export let showArrow = true;
</script>

<div class="category">
    <div class="icon">
        <slot name="icon"/>
    </div>
    <div class="column">
        <TextBlock variant="bodyStrong">{title}</TextBlock>
        <TextBlock>{description}</TextBlock>
    </div>
    <div class="align-right">
        <slot name="action"/>
        {#if showArrow}
            <TextBlock>＞</TextBlock>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "ActionBlock";
</style>