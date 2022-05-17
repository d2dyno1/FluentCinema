<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import type { Movie } from "$db/movie/Movie";
    import type { Review } from "$db/movie/Review";

    export let reviews: Review[];
    export let screeningDates: TableDateItem[][] = [[]];

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: Movie = await response.json();
        reviews = await (await fetch(`/api/cinema/movie/${params.id}/review/list`)).json();

        fetch(`/api/cinema/screenings?movieId=${movie.id}`).then(response => response.json()).then((data: Screening[]) => {
            let lastDate: Date;
            data.forEach((x: Screening) => {
                if (!lastDate || lastDate != x.start)
                {
                    screeningDates.push([]);
                }

                screeningDates[--screeningDates.length].push({ date: x.start });
                lastDate = x.start;
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

    export let movie: Movie;
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
    <MovieDateSection movie={movie} screeningDates={screeningDates}/>
    <ReviewsSection reviews={reviews}/>
</div>

<style lang="scss">
    @use "movie";
</style>