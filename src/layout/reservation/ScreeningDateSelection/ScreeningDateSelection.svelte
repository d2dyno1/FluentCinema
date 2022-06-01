<script lang="ts">
    import type { Movie } from "$api/Movie";
    import type { DateWithType, TableDateItem } from "$data/table";
    import { Button, CalendarView } from "fluent-svelte";
    import { getFriendlyScreeningTypeName, getScreeningsFormatted } from "$lib/utils";
    import moment from "moment";
    import { Cinema } from "$api/Cinema";
    import { onMount } from "svelte";
    import { Screening } from "$api/Screening";

    export let cinema: Cinema;
    export let movie: Movie;
    export let selectedScreening: Screening;

    let screenings: Screening[] = [];
    let selectedDate: Date = new Date();

    const yesterday = new Date();
    const nextMonth = new Date();

    $: filteredScreenings = screenings.filter(screening => (screening.start as Date).getDate() == selectedDate.getDate());

    $: {
        (async () => {
            screenings = await Screening.getFromMovieAndCinemaId(fetch, movie.id, cinema.id);
        })();
    }

    yesterday.setDate(yesterday.getDate() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
</script>

<div class="wrapper">
    <CalendarView min={yesterday} max={nextMonth} bind:value={selectedDate}/>
    <div class="date-section">
        <div class="day-title">
            {#if selectedDate}
                {moment(selectedDate).format('dddd')}
            {:else}
                Select day...
            {/if}
        </div>
        <div class="details">
            {#if selectedDate}
            <div class="time-list">
                {#if screenings}
                    {#each filteredScreenings as screening}
                        <div>
                            <Button variant={screening == selectedScreening ? "accent" : "standard"} on:click={() => selectedScreening = screening}>{moment(screening.start).format('HH:mm')}</Button>
                        </div>
                    {/each}
                {/if}
            </div>
            <p class="screening-details">
                Type: {getFriendlyScreeningTypeName(selectedScreening?.type)}
                <br/>
                Length: {movie.length}
            </p>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @use "ScreeningDateSelection";
</style>