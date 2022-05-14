<script lang="ts" context="module">
    import type {Load} from "@sveltejs/kit";
    import type {MovieData} from "../../data/movies";

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: MovieData = await response.json();
        movie.release = new Date(movie.release);

        return {
            status: 200,
            props: {
                movie: movie
            }
        }
    }

</script>

<script lang="ts">
    import { MovieHeroSection, ReviewsSection } from "$layout";
    export let movie: MovieData;

</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    <ReviewsSection/>
</div>

<style lang="scss">
    @use "movie";
</style>