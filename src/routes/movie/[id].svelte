<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import type { Movie } from "$db/movie/Movie";
    import type { Review } from "$db/movie/Review";

    export let reviews: Review[];

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: Movie = await response.json();
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

    export let movie: Movie;
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    <MovieDateSection movie={movie}/>
    <ReviewsSection reviews={reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>