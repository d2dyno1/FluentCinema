<script lang="ts">
    import type { Movie } from "$api/Movie";
    import { Button, ContentDialog } from "fluent-svelte";
    import { MovieRating } from "$lib";
    import { MovieType } from "$data/MovieType";
    import { accountSession } from "$/stores";
    import { goto } from "$app/navigation";

    import TimerIcon from "@fluentui/svg-icons/icons/timer_32_filled.svg?raw";
    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_star_24_filled.svg?raw";

    export let movie: Movie;

    let loginDialogPromptOpened = false;

    function makeReservation() {
        if (!$accountSession.isLoggedIn) {
            loginDialogPromptOpened = true;
        } 
        else {
            goto(`/movie/${movie.id}/reservation`);
        }
    }
</script>

<ContentDialog title="Invalid operation" open={loginDialogPromptOpened} closable={false}>
    You need to be logged-in in order to make a reservation.
    <Button variant="accent" slot="footer" on:click={() => loginDialogPromptOpened = false}>Ok</Button>
</ContentDialog>

<div class="movie-content">
    <picture>
        <img class="movie-poster" alt="img" src="/api/movie/{movie.id}/poster">
    </picture>
    <div class="description">
        <div class="title">
            <div class="title-text">
                {movie.name}
                {#if movie.type != MovieType.SERIES}
                    <div class="subtitle-text">
                        {movie.description}
                    </div>
                {/if}
            </div>
            <div>
                {#if movie.type != MovieType.SERIES}
                    <Button variant="accent" on:click={makeReservation}>Watch now</Button>
                {:else}
                    <Button variant="accent">Available on FluentTV</Button>
                {/if}
            </div>
        </div>
        <div class="length-and-premiere">
            {#if movie.type == MovieType.MOVIE}
                <div>
                    {@html TimerIcon} {movie.length}min
                </div>
            {/if}
            <div>
                {@html CalendarIcon} {new Date(movie.release).toLocaleDateString()}
            </div>
            <div>
                <MovieRating {movie}/>
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