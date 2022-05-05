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
                image: "https://www.withanaccent.com/wp-content/uploads/2019/01/john-wick-3-banner.jpg"
            },
            {
                name: "Mission Impossible",
                description: "Ghost Protocol",
                image: "https://spotlightreport.net/wp-content/uploads/2011/09/mission-impossible-ghost-protocol-banner.jpg"
            },
            {
                name: "Star Wars",
                description: "Episode IX",
                image: "https://coldfeet-space.nyc3.cdn.digitaloceanspaces.com/wsb/2017/12/star-wars-last-jedi-banner.jpg"
            }
        ];

        return objects;
    }
</script>

<HeroSection cards={movieCards}/>