<script lang="ts">
    import { Movie } from "$api/Movie";
    import { Rating } from "$lib";

    export let movie: Movie;
</script>

<Rating rating={movie.rating} text={movie.rating == 0 ? "No reviews" : `${movie.rating}/5`}/>

<style lang="scss">
    @use "MovieRating";
</style>