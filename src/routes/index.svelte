<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import { ok } from "$api/responses";
    import type { Load } from "@sveltejs/kit";
    import { Movie } from "$api/Movie";

    export let promise: Promise<any>;

    export const load: Load = async ({ fetch }) => {
        promise = Movie.getList(fetch);
        return ok;
    }

</script>

{#await promise then movies}
    <HeroSection cards={movies}/>
    <MoviesSection positions={movies}/>
{/await}

