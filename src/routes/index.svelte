<script lang="ts">
    import { HeroSection, MoviesSection } from "$layout";
    import type { MovieData } from "$data/movies";

    // TODO: Load from database
    const headlineMovies: MovieData[] = enumerateHeadlineMoviesFromDb();
    const allMovies: MovieData[] = enumerateMoviesFromDb();

    // TODO: Note: All objects from the database must come with all properties filled - no null's left behind
    function enumerateHeadlineMoviesFromDb(): MovieData[]
    {
        // TODO: Just for testing
        const objects: MovieData[] = [
            {
                name: "John Wick",
                description: "Chapter 3 Parabellum",
                descriptionExtended: "yes here yes",
                rating: 4.6,
                bannerImage: "/static/images/JohnWick3/John-Wick-3.png",
                posterImage: "/static/images/JohnWick3/John-Wick-3-poster.jpg"
            },
            {
                name: "Mission Impossible",
                description: "Ghost Protocol",
                descriptionExtended: "yes here yes",
                rating: 4.8,
                bannerImage: "/static/images/MissionImpossible/Mission-Impossible.png",
                posterImage: "/static/images/MissionImpossible/Mission-Impossible-poster.jpg"
            },
            {
                name: "Star Wars",
                description: "Episode IX: The Last Jedi",
                descriptionExtended: "yes here yes",
                rating: 4.4,
                bannerImage: "/static/images/StarWars8/Star-Wars-The-Last-Jedi.png",
                posterImage: "/static/images/StarWars8/Star-Wars-The-Last-Jedi-banner.jpg"
            }
        ];

        return objects;
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

<HeroSection cards={headlineMovies}/>

<MoviesSection positions={allMovies}/>