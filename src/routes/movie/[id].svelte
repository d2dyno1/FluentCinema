<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { ReviewApiContext } from "$api/ReviewApiContext";
    import { MovieApiContext } from "$api/MovieApiContext";
    import type { TableDateItem } from "$/data/table";
    import { ScreeningApiContext } from "$api/ScreeningApiContext";

    export let reviews: ReviewApiContext[];
    export let screeningDates: TableDateItem[] = [];

    let screeningDatesPromise: Promise<any>;

    export const load: Load = async ({ params, fetch }) => {
        let movie = await MovieApiContext.getFromId(fetch, params.id);
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
                screeningDates[(startDate.getDay() - 1)].dates ??= [];
                screeningDates[(startDate.getDay() - 1)].dates?.push(startDate);
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
    import { MovieHeroSection, MovieDateSection, ReviewsSection } from "$layout";
    import { ProgressRing } from "fluent-svelte";
    import moment from "moment";

    export let movie: MovieApiContext;
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    {#await screeningDatesPromise}
        <div>
            <ProgressRing size={64}/>
        </div>
    {:then _} 
        <MovieDateSection movie={movie} {screeningDates}/>
    {/await}
    <ReviewsSection reviews={reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>