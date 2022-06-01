<script lang="ts">
    import type { Movie } from "$api/Movie";
    import type { TableDateItem } from "$data/table";
    import { Button, CalendarView } from "fluent-svelte";
    import moment from "moment";

    export let movie: Movie;
    export let screeningDates: TableDateItem[] = [];
    export let selectedDate: Date = new Date();

    const today: Date = new Date();
    const yesterday = new Date();
    const nextMonth = new Date();

    $: dates = screeningDates[screeningDates.findIndex(x => x.day == today.getDay())]?.dates;

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
                {#if dates}
                {#each dates as sc}
                    <div>
                        <Button variant="standard">{moment(sc.date).format('hh:mm')}</Button>
                    </div>
                {/each}
                {/if}
                <Button variant="standard">17:30</Button>
                <Button variant="accent">19:30</Button>
                <Button variant="standard">22:00</Button>
            </div>
            <div class="screening-details">
                
            </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @use "ScreeningDateSelection";
</style>