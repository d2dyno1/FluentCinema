<script lang="ts">
    import StarRating from "svelte-star-rating";
    import { TextBlock } from "fluent-svelte";
    import type { Movie } from "$db/movie/Movie";

    export let movie: Movie;
</script>

<div class="movie-rating">
    <div>
        <StarRating rating={movie.rating}/>
    </div>
    <TextBlock variant="caption">{movie.rating == 0 ? "No reviews" : `${movie.rating}/5`}</TextBlock>
</div>

<style lang="scss">
    @use "MovieRating";
</style>