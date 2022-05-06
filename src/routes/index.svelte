<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import { ok } from "../lib/responses";

    export let promise;

    export async function load({ fetch }) {
        promise = fetch("/api/movies", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json())

        return ok;
    }
</script>

{#await promise then movies}
    <HeroSection cards={movies}/>
    <MoviesSection positions={movies}/>
{/await}