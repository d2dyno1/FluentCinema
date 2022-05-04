<script lang="ts">
    import { HeroSection } from "../layout";
    import type { MovieCard } from "$data/cards";

    // TODO: Load from database
    const movieCards: MovieCard[] = enumerateHeadlineMoviesFromDb();

    function enumerateHeadlineMoviesFromDb(): MovieCard[]
    {
        const objects: MovieCard[] = [
            {
                name: "John Wick",
                description: "Chapter 3 Parabellum",
                icon: null
            },
            {
                name: "Mission Impossible",
                description: "Ghost Protocol",
                icon: null
            }
        ];

        return objects;
    }
</script>

<HeroSection cards={movieCards}/>