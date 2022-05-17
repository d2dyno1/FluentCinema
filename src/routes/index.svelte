<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import { ok } from "$api/responses";
    import type {Load} from "@sveltejs/kit";
    import {MovieResponse} from "../data/response/MovieResponse";

    export let promise;

    export const load: Load = async ({ fetch }) => {
        promise = fetch("/api/cinema/movie/list", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(response => Object.assign(new MovieResponse(), response));
        return ok;
    }

</script>

{#await promise then movies}
    <HeroSection cards={movies}/>
    <MoviesSection positions={movies}/>
{/await}

