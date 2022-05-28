<script lang="ts" context="module">
    import { MoviePosition } from "$lib";
    import { MovieApiContext } from "../../api/MovieApiContext";
    import { ProgressRing } from "fluent-svelte";

    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";

    export let promise: Promise<MovieApiContext[]>;

    export const load: Load = async ({ fetch }) => {
        promise = MovieApiContext.getAll(fetch);
        return ok;
    }
</script>

{#await promise}
<div class="center">
    <ProgressRing size={64}/>
</div>
{:then movies}
<div class="wrapper">
    <div class="title">
        All movies
    </div>
    <div class="movie-list">
        {#each movies as movie}
            <div class="movie-position-wrapper">
                <MoviePosition {movie}/>
            </div>
        {/each}
    </div>
</div>
{/await}

<style lang="scss">
    @use "all-movies";
</style>