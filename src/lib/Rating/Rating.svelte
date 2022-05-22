<script lang="ts">
    import StarRating from "svelte-star-rating";
    import { onMount } from "svelte";
    import { TextBlock } from "fluent-svelte";

    export let rating: number;
    export let text: string;
    let config: any;

    onMount(() => {
        let computedTheme = getComputedStyle(document.body);
        config = {
            fullColor: computedTheme.getPropertyValue('--fds-text-secondary'),
            emptyColor: "hsla(0, 0%, 0%, 12%)",
            size: 16
        }
    });
</script>

<div class="rating">
    {#if config != null}
        <StarRating {config} rating={rating}/>
        {#if text != null}
            <TextBlock variant="caption">{text}</TextBlock>
        {/if}
    {/if}
</div>

<style lang="scss">
    @use "Rating";
</style>