<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { ReviewResponse } from "$data/response/ReviewResponse";
    import { MovieResponse } from "../../data/response/MovieResponse";

    export let reviews: ReviewResponse[];
    export let screeningDates: TableDateItem[][] = [];

    let screeningDatesPromise;

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: MovieResponse = await response.json();
        reviews = await (await fetch(`/api/cinema/movie/${params.id}/review/list`)).json();

        screeningDatesPromise = fetch(`/api/cinema/screenings?movieId=${movie.id}`).then(response => response.json()).then((data: Screening[]) => {
            let lastDate: Date;
            data.forEach((x: Screening) => {
                let startDate = new Date(x.start);
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
    import type { TableDateItem } from "$/data/table";
    import type { Screening } from "$/db/movie/Screening";

    export let movie: MovieResponse;
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