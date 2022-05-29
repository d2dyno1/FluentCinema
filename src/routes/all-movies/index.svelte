<script lang="ts" context="module">
    import { MoviePosition } from "$lib";
    import { Movie } from "$api/Movie";
    import { ProgressRing } from "fluent-svelte";

    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";

    export let promise: Promise<Movie[]>;

    export const load: Load = async ({ fetch }) => {
        promise = Movie.getList(fetch);
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