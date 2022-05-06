<script lang="ts">
    import { MoviePosition } from "$lib";
    import type { MovieData } from "$data/movies";

    export let positions: MovieData[] = [];
</script>

<div class="movie-positions">
    {#each positions as { name, description, description_extended, rating, poster_image }}
        <MoviePosition name={name} episode={description} description={description_extended} rating={rating} image={poster_image} />
    {/each}
</div>

<style lang="scss">
    @use "MoviesSection";
</style>