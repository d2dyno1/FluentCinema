<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import type { ReviewApiContext } from "$api/ReviewApiContext";
    import type { ScreeningApiContext } from "$api/ScreeningApiContext";
    import type { TableDateItem } from "$/data/table";
    import { MovieApiContext } from "$api/MovieApiContext";

    export let reviews: ReviewApiContext[];
    export let screeningDates: TableDateItem[] = [];

    let screeningDatesPromise: Promise<any>;

    export const load: Load = async ({ params, fetch }) => {
        let movie = await MovieApiContext.getFromId(fetch, params.id);
        if (!movie)
        {
            return {
                status: 403,
                props: { }
            };
        }

        reviews = await movie.getReviews(fetch);

        screeningDatesPromise = movie.getScreenings(fetch).then((data: ScreeningApiContext[]) => {
            // Fill the table
            for (let i = 0; i < 7 /* Week days*/; i++)
            {
                screeningDates.push({dayName: moment().add(i, 'day').format('dddd')});
            }
            
            // Fill screenings
            data.forEach(x => {
                let startDate = x.start;
                let day = startDate.getDay() - 1;
                if (day < 0) {
                    day = 6;
                }
                screeningDates[day].dates ??= [];
                screeningDates[day].dates?.push({ date: startDate, type: x.type });
            });
        });

        return {
            status: 200,
            props: {
                movie: movie
            }
        };
    }
</script>

<script lang="ts">
    import { MovieHeroSection, MovieDateSection, MovieReviewsSection } from "$layout";
    import { ProgressRing } from "fluent-svelte";
    import moment from "moment";

    export let movie: MovieApiContext;
</script>

<div class="wrapper">
    <MovieHeroSection {movie}/>
    {#await screeningDatesPromise}
        <div>
            <ProgressRing size={64}/>
        </div>
    {:then _}
        <MovieDateSection {movie} {screeningDates}/>
    {/await}
    <MovieReviewsSection {reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>