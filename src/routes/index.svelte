<script lang="ts" context="module">
    import { HeroSection, MoviesSection } from "$layout";
    import type { MovieData } from "$data/movies";
    import { LoginFlyout } from "$layout";
    import { ok } from "../lib/responses";

    export let promise;
    export let headlineMovies: MovieData[];
    export let allMovies: MovieData[];

    export async function load({ fetch }) {
        promise = fetch("/api/movies", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(movies => {
            headlineMovies = movies;
            allMovies = [...movies];
        });

        return ok;
    }
</script>

{#await promise}
    <p>Loading movies...</p>
{:then value}
    <HeroSection cards={headlineMovies}/>
    <MoviesSection positions={allMovies}/>
{/await}

<LoginFlyout/>