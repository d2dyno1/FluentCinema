<script lang="ts">
    import { Button } from "fluent-svelte";
    import { MoviePosition } from "$lib";
    import { MovieResponse } from "$data/response/MovieResponse";

    export let positions: MovieResponse[] = [];
</script>

<div class="wrapper">
    <div class="header">
        <h2>
            Explore
        </h2>
        <Button variant="hyperlink" href="/all-movies">See all</Button> <!-- TODO: Add click -->
    </div>
    <div class="movie-positions">
        {#each positions as movie}
        <MoviePosition {movie}/>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "MoviesSection";
</style>