<script lang="ts" context="module">
    import { MoviePosition } from "$lib";
    import { ProgressRing } from "fluent-svelte";

    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";


    export let promise: Promise<any>;

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
<div class="wrapper">
    <div class="title">
        All movies
    </div>
    <div class="movie-list">
        {#each movies as movie}
        <MoviePosition {movie}/>
        {/each}
    </div>
</div>
{/await}

<style lang="scss">
    @use "all-movies";
</style>