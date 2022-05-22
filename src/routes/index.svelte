<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";
    import { MovieApiContext } from "$api/MovieApiContext";

    export let promise;

    export const load: Load = async ({ fetch }) => {
        promise = MovieApiContext.getAll(fetch);
        return ok;
    }

</script>

{#await promise then movies}
    <HeroSection cards={movies}/>
    <MoviesSection positions={movies}/>
{/await}

