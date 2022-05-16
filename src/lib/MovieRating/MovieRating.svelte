<script lang="ts">
    import StarRating from "svelte-star-rating";
    import { TextBlock } from "fluent-svelte";
    import type { Movie } from "$db/movie/Movie";
    
    export let movie: Movie;

    const computedTheme = getComputedStyle(document.body);
    const config = {
        fullColor: computedTheme.getPropertyValue('--fds-text-secondary'),
        emptyColor: "hsla(0, 0%, 0%, 12%)",
        size: 16
    }

</script>

<div class="movie-rating">
    <StarRating {config} rating={movie.rating}/>
    <TextBlock variant="caption">{movie.rating == 0 ? "No reviews" : `${movie.rating}/5`}</TextBlock>
</div>

<style lang="scss">
    @use "MovieRating";
</style>