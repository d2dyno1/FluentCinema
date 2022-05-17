<script lang="ts">
    import StarRating from "svelte-star-rating";
    import { TextBlock } from "fluent-svelte";
    import type { Movie } from "$db/movie/Movie";
    import {onMount} from "svelte";
    
    export let movie: Movie;

    let config;

    onMount(() => {
        let computedTheme = getComputedStyle(document.body);
        config = {
            fullColor: computedTheme.getPropertyValue('--fds-text-secondary'),
            emptyColor: "hsla(0, 0%, 0%, 12%)",
            size: 16
        }
    });
</script>

<div class="movie-rating">
    {#if config != null}
        <StarRating {config} rating={movie.rating}/>
        <TextBlock variant="caption">{movie.rating == 0 ? "No reviews" : `${movie.rating}/5`}</TextBlock>
    {/if}
</div>

<style lang="scss">
    @use "MovieRating";
</style>