<script lang="ts">
    import { MovieRating } from "$lib";
    import { MovieApiContext } from "../../api/MovieApiContext";

    export let movie: MovieApiContext;
</script>

<a class="item" href="/movie/{movie.id}">
    <div class="item-inner">
        <picture>
            <img class="item-poster" alt={movie.name} src="/api/cinema/movie/{movie.id}/poster">
        </picture>
        <div class="details">
            <div>
                <h4 class="title">{movie.name}</h4>
                <div class="subtitle">{movie.description}</div>
                <div class="description-text">{movie.descriptionExtended}</div>
            </div>
            <MovieRating {movie}/>
        </div>
    </div>
</a>

<style lang="scss">
    @use "MoviePosition";
</style>