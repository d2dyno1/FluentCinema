<script lang="ts" context="module">
    import type {Load} from "@sveltejs/kit";
    import type {Movie} from "$db/movie/Movie";

    export const load: Load = async ({ params, fetch }) => {
        let response = await fetch(`/api/cinema/movie/${params.id}`);
        let movie: Movie = await response.json();

        return {
            status: 200,
            props: {
                movie: movie
            }
        }
    }

</script>

<script lang="ts">
    import { MovieHeroSection } from "$layout";

    export let movie: Movie;

    
</script>

<div class="wrapper">
    <MovieHeroSection movie={movie}/>
</div>

<style lang="scss">
    @use "movie";
</style>