<script lang="ts">
    import type { Movie } from "$api/Movie";
    import { MovieRating } from "$lib";

    export let movie: Movie;
    
</script>

<a class="item" href="/movie/{movie.id}" sveltekit:prefetch>
    <div class="item-inner">
        <picture>
            <img class="item-poster" alt={movie.name} src="/api/movie/{movie.id}/poster">
        </picture>
        <div class="details">
            <h4 class="title">{movie.name}</h4>
            <div class="subtitle">{movie.description}</div>
            <div>
                <div class="description-text">{movie.descriptionExtended}
                    <div class="description-overlay"/>
                </div>
            </div>
            <MovieRating {movie}/>
        </div>
    </div>
</a>

<style lang="scss">
    @use "MoviePosition";
</style>