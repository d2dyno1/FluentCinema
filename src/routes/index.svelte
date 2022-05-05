<script lang="ts">
    import { HeroSection } from "../layout";
    import type { MovieData } from "$data/movies";

    // TODO: Load from database
    const movieData: MovieData[] = enumerateHeadlineMoviesFromDb();

    function enumerateHeadlineMoviesFromDb(): MovieData[]
    {
        const objects: MovieData[] = [
            {
                name: "John Wick",
                description: "Chapter 3 Parabellum",
                image: "/static/images/John-Wick-3.png"
            },
            {
                name: "Mission Impossible",
                description: "Ghost Protocol",
                image: "/static/images/Mission-Impossible.png"
            },
            {
                name: "Star Wars",
                description: "Episode IX: The Last Jedi",
                image: "/static/images/Star-Wars-The-Last-Jedi.png"
            }
        ];

        return objects;
    }
</script>

<HeroSection cards={movieData}/>