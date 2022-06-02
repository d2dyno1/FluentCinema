<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { Movie } from "$api/Movie";
    import { Cinema } from "$api/Cinema";

    export const load: Load = async ({ params, fetch }) => {
        let movie = await Movie.getFromId(fetch, params.id);
        if (!movie) {
            return {
                status: 302,
                redirect: "/"
            };
        }
        return {
            status: 200,
            props: {
                movie,
                cinemas: await Cinema.getList(fetch),
                reviewsPromise: movie.getReviews(fetch),
                screeningDatesPromise: movie.getScreenings(fetch)
            }
        };
    }
</script>

<script lang="ts">
    import type { TableDateItem } from "$data/table";
    import { MovieHeroSection, MovieDateSection, MovieReviewsSection } from "$layout";
    import { ProgressRing } from "fluent-svelte";
    import { MovieType } from "$data/MovieType";
    import { getScreeningsFormatted } from "$lib/utils";
    import { CinemaSelection } from "$layout";
    import { Screening } from "$api/Screening";

    export let movie: Movie;
    export let cinemas: Cinema[];
    export let reviewsPromise: Promise<any>;
    export let screeningDatesPromise: Promise<Screening[]>;

    let selectedCinema: Cinema;

    let screeningDates: TableDateItem[] = [];
    $: (async () => {
        if (movie.type == MovieType.MOVIE) {
            if (selectedCinema == null) {
                screeningDates = [];
            } else {
                screeningDatesPromise = Screening.getFromMovieAndCinemaId(fetch, movie.id, selectedCinema.id);
                screeningDates = getScreeningsFormatted(selectedCinema.id, await screeningDatesPromise);
            }
        }
    })();
</script>

<div class="wrapper">
    <MovieHeroSection {movie}/>
    {#if movie.type == MovieType.MOVIE}
        <CinemaSelection {cinemas} bind:selectedCinema={selectedCinema}/>
        {#if screeningDatesPromise != null}
            {#await screeningDatesPromise}
                <div class="progress-ring-overlay">
                    <ProgressRing size={64}/>
                </div>
            {:then _}
                <MovieDateSection {screeningDates}/>
            {/await}
        {/if}
    {/if}
    {#await reviewsPromise}
        <div class="progress-ring-overlay">
            <ProgressRing size={64}/>
        </div>
    {:then reviews} 
        <MovieReviewsSection {reviews}/>
    {/await}
</div>

<style lang="scss">
    @use "movie";
</style>