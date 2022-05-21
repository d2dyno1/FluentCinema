<script lang="ts" context="module">
    import { MoviePosition } from "$lib";
    import { MovieResponse } from "$data/response/MovieResponse";
    import { ProgressRing } from "fluent-svelte";

    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";


    export let promise;

    export const load: Load = async ({ fetch }) => {
        promise = fetch("/api/cinema/movie/list", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json());
        return ok;
    }
</script>

{#await promise}
    <div class="center">
        <ProgressRing size={64}/>
    </div>
{:then movies}
    <div class="movie-list">
        {#each movies as movie}
            <MoviePosition {movie}/>
        {/each}
    </div>
{/await}

<style lang="scss">
    @use "all-movies";
</style>