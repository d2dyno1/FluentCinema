<script lang="ts">
    import { MoviePosition } from "$lib";
    import type { MovieData } from "$data/movies";

    export let positions: MovieData[] = [];
</script>

<div class="movie-positions">
    {#each positions as { name, description, descriptionExtended, rating, posterImage }}
        <MoviePosition name={name} episode={description} description={descriptionExtended} rating={rating} image={posterImage} />
    {/each}
</div>

<style lang="scss">
    @use "MoviesSection";
</style>