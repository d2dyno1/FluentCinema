<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import { ok } from "$api/responses";
    import type {Load} from "@sveltejs/kit";

    export let promise;

    export const load: Load = async ({ fetch }) => {
        promise = fetch("/api/movies", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json());
        return ok;
    }

</script>

{#await promise then movies}
    <HeroSection cards={movies}/>
    <MoviesSection positions={movies}/>
{/await}

