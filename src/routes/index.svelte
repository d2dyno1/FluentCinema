<script lang="ts" context="module">
    import type { MovieData } from "$data/movies";

    export let promise;
    export let headlineMovies: MovieData[];
    export let allMovies: MovieData[];

    export async function load({ fetch }) {
        promise = fetch("/api/movies", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        return {
            status: 200
        }
    }
</script>

<script lang="ts">
    import { HeroSection, MoviesSection } from "$layout";
    import type { MovieData } from "$data/movies";
    import { LoginFlyout } from "$layout";

    promise = promise.then(response => response.json()).then(movies => {
        headlineMovies = movies;
        allMovies = movies;
    });


    // TODO: Load from database

    // TODO: Note: All objects from the database must come with all properties filled - no null's left behind
    function enumerateHeadlineMoviesFromDb()
    {
        return null;
    }

    // TODO: Note: All objects from the database must come with all properties filled - no null's left behind
    function enumerateMoviesFromDb(): MovieData[]
    {
        // TODO: Just for testing
        const objects: MovieData[] = [
            ...enumerateHeadlineMoviesFromDb(), // TODO: Just for testing
            // More movies
        ]

        return objects;
    }
</script>

{#await promise}
    <p>Loading movies...</p>
{:then value}
    <HeroSection cards={headlineMovies}/>
    <MoviesSection positions={allMovies}/>
{/await}

<LoginFlyout/>