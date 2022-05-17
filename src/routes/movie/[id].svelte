<script lang="ts" context="module">
    import type {Load} from "@sveltejs/kit";
    import {ReviewResponse} from "$data/response/ReviewResponse";
    import {MovieResponse} from "../../data/response/MovieResponse";

    export let reviews: ReviewResponse[];

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: MovieResponse = await response.json();
        reviews = await (await fetch(`/api/cinema/movie/${params.id}/review/list`)).json();

        return {
            status: 200,
            props: {
                movie: movie
            }
        }
    }
</script>

<script lang="ts">
    import { MovieHeroSection, MovieDateSection, ReviewsSection } from "$layout";
    export let movie: MovieResponse;
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    <MovieDateSection movie={movie}/>
    <ReviewsSection reviews={reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>