<script lang="ts">
    import { Button } from "fluent-svelte";
    
    import TimerIcon from "@fluentui/svg-icons/icons/timer_32_filled.svg?raw";
    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_star_24_filled.svg?raw";
    import type {Movie} from "$db/movie/Movie";

    export let movie: Movie;
</script>

<div class="movie-content">
    <picture>
        <img class="movie-poster" alt="img" src={movie.posterImage}>
    </picture>
    <div class="description">
        <div class="title">
            {movie.name}
            <div>
                <Button variant="accent">Watch now</Button>
            </div>
        </div>
        <div class="length-and-premiere">
            <div>
                {@html TimerIcon} {movie.length}min
            </div>
            <div>
                {@html CalendarIcon} {movie.release.toLocaleDateString()}
            </div>
        </div>
        <div class="movie-description">
            {movie.descriptionExtended}
        </div>
    </div>
</div>

<style lang="scss">
    @use "MovieHeroSection";
</style>