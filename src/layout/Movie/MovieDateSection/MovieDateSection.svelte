<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { MovieApiContext } from "../../../api/MovieApiContext";
    import moment from "moment";

    export let movie: MovieApiContext;
    export let screeningDates: TableDateItem[] = [];
</script>

{#if screeningDates}
    <div class="wrapper">
        {#each screeningDates as item}
            <div class="column">
                <div class="column-header">
                    {item.dayName}
                </div>
                <div>
                    {#if item.dates}
                        {#each item.dates as date}
                            {moment(date).format('hh:mm')}
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    @use "MovieDateSection";
</style>