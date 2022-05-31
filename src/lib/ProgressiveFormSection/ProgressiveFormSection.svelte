<script lang="ts">
    import { Button } from "fluent-svelte";

    export let currentSection: boolean;
    export let nextSection: boolean = false;
    export let continueCallback: (() => void) = () => { };
    export let buttonText: string = "Continue";

    function switchSection() {
        currentSection = false;
        setTimeout(() => {
            nextSection = true;
            continueCallback();
        }, 500);
    }
</script>

<div class="wrapper">
    <div>
        <slot name="content"/>
    </div>
    <div>
        <Button on:click={switchSection}>{buttonText}</Button>
    </div>
</div>

<style lang="scss">
    @use "ProgressiveFormSection";
</style>