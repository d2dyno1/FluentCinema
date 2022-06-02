<script lang="ts">
    import { Button } from "fluent-svelte";

    export let currentSection: boolean;
    export let nextSection: boolean = false;
    export let continueCallback: (() => void) = () => { };
    export let buttonText: string = "Continue";
    export let useCustomButton: boolean;

    function switchSection() {
        currentSection = false;
        setTimeout(() => {
            nextSection = true;
            continueCallback();
        }, 500);
    }
</script>

<div class="wrapper">
    <div class="content">
        <slot name="content"/>
    </div>
    <div>
        {#if useCustomButton}
            <slot name="button"/>
        {:else}
            <Button on:click={switchSection}>{buttonText}</Button>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "ProgressiveFormSection";
</style>