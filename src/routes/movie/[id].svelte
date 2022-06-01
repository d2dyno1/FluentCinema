<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { Movie } from "$api/Movie";

    export const load: Load = async ({ params, fetch }) => {
        let movie = await Movie.getFromId(fetch, params.id);
        if (!movie) {
            return {
                status: 403,
            };
        }
        return {
            status: 200,
            props: {
                movie,
                reviewsPromise: movie.getReviews(fetch),
                screeningDatesPromise: movie.getScreenings(fetch)
            }
        };
    }
</script>

<script lang="ts">
    import type { TableDateItem } from "$data/table";
    import type { Screening } from "$api/Screening";
    import { MovieHeroSection, MovieDateSection, MovieReviewsSection } from "$layout";
    import { ProgressRing } from "fluent-svelte";
    import { MovieType } from "$data/MovieType";
    import moment from "moment";

    export let movie: Movie;
    export let reviewsPromise: Promise<any>;
    export let screeningDatesPromise: Promise<any>;

    let screeningDates: TableDateItem[] = [];


    function fillScreenings(cinemaId: string) {
        if (movie.type != MovieType.SERIES) {
            screeningDatesPromise.then((data: Screening[]) => {
                // Fill the table
                for (let i = 0; i < 7 /* Week days */; i++)
                {
                    screeningDates.push({dayName: moment().add(i, 'day').format('dddd')});
                }

                // Fill screenings
                data.forEach(x => {
                    if (x.cinemaId != cinemaId) {
                        return;
                    }

                    let startDate = x.start as Date;
                    let day = startDate.getDay() - 1;
                    if (day < 0) {
                        day = 6;
                    }
                    screeningDates[day].dates ??= [];
                    screeningDates[day].dates?.push({ date: startDate, type: x.type });
                });
            });
        }
    }
</script>

<div class="wrapper">
    <MovieHeroSection {movie}/>
    {#if movie.type != MovieType.SERIES}
        {#await screeningDatesPromise}
            <div class="progress-ring-overlay">
                <ProgressRing size={64}/>
            </div>
        {:then _}
            <MovieDateSection {screeningDates}/>
        {/await}
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