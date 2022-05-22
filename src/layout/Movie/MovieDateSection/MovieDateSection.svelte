<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { MovieApiContext } from "../../../api/MovieApiContext";
    import moment from "moment";

    export let movie: MovieApiContext;
    export let screeningDates: TableDateItem[] = [];
</script>

{#if screeningDates}
    <div class="columns">
        {#each screeningDates as item}
            <div class="column">
                <div class="column-header">
                    {item.dayPrefix}
                </div>
                <div>
                    {#if item.dates}
                        {#each item.dates as date}
                        <div class="column-row">
                            {moment(date).format('hh:mm')}
                        </div>
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