<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { ReviewApiContext } from "$api/ReviewApiContext";
    import { MovieApiContext } from "$api/MovieApiContext";
    import type { TableDateItem } from "$/data/table";
    import { ScreeningApiContext } from "$api/ScreeningApiContext";

    export let reviews: ReviewApiContext[];
    export let screeningDates: TableDateItem[][] = [];

    let screeningDatesPromise: Promise<any>;

    export const load: Load = async ({ params, fetch }) => {
        let movie = await MovieApiContext.getFromId(fetch, params.id);
        reviews = await movie.getReviews(fetch);

        screeningDatesPromise = movie.getScreenings(fetch).then((data: ScreeningApiContext[]) => {
            let lastDate: Date;
            data.forEach(x => {
                let startDate = x.start;
                if (!lastDate || lastDate != startDate)
                {
                    screeningDates.push([]);
                }

                screeningDates[(screeningDates.length - 1)].push({ date: startDate });
                lastDate = startDate;
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

    export let movie: MovieApiContext;
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    {#await screeningDatesPromise then x}
        <MovieDateSection movie={movie} {screeningDates}/>
    {/await}
    <ReviewsSection reviews={reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>