<script lang="ts">
    import { HeroSection, MoviesSection } from "$layout";
    import type { MovieData } from "$data/movies";
    import { LoginFlyout } from "$layout";

    // TODO: Load from database
    const movieData: MovieData[] = enumerateHeadlineMoviesFromDb();

    function enumerateHeadlineMoviesFromDb(): MovieData[]
    {
        const objects: MovieData[] = [
            {
                name: "John Wick",
                description: "Chapter 3 Parabellum",
                bannerImage: "/static/images/John-Wick-3.png"
            },
            {
                name: "Mission Impossible",
                description: "Ghost Protocol",
                bannerImage: "/static/images/Mission-Impossible.png"
            },
            {
                name: "Star Wars",
                description: "Episode IX: The Last Jedi",
                bannerImage: "/static/images/Star-Wars-The-Last-Jedi.png"
            }
        ];

        return objects;
    }
</script>

<HeroSection cards={movieData}/>

<MoviesSection/>

<LoginFlyout/>