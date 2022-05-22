<script lang="ts">
    import { MovieApiContext } from "$api/MovieApiContext";
    import { Rating } from "$lib/index.js";

    export let movie: MovieApiContext;
</script>

<Rating rating={movie.rating} text={movie.rating == 0 ? "No reviews" : `${movie.rating}/5.0`}/>

<style lang="scss">
    @use "MovieRating";
</style>