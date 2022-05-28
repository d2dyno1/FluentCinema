<script lang="ts">
    import { TextBlock } from "fluent-svelte";

    export let isClickableEffect: boolean = false;
    export let title: string;
    export let description: string;
    export let icon: any;
</script>

<div class="action-block" on:click class:isClickableEffect>
    {#if icon != null}
        {@html icon}
    {/if}
<!--    <div class="icon">-->
<!--        <slot name="icon"/>-->
<!--    </div>-->
    <div class="column">
        <TextBlock>{title}</TextBlock>
        <div class="description-section">{description}</div>
    </div>
    <div class="align-right">
        <slot name="action"/>
    </div>
</div>

<style lang="scss">
    @use "ActionBlock";
</style>