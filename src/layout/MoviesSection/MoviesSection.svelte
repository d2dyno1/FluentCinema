<script lang="ts">
    import { Button } from "fluent-svelte";
    import { MoviePosition } from "$lib";
    import type { Movie } from "$db/movie/Movie";

    export let positions: Movie[] = [];
</script>

<div class="wrapper">
    <div class="header">
        <h2>
            Explore
        </h2>
        <Button variant="hyperlink" on:click>See all</Button> <!-- TODO: Add click -->
    </div>
    <div class="movie-positions">
        {#each positions as { name, description, descriptionExtended, rating, posterImage }}
        <MoviePosition name={name} episode={description} description={descriptionExtended} rating={rating} image={posterImage} />
        {/each}
    </div>
</div>

<style lang="scss">
    @use "MoviesSection";
</style>