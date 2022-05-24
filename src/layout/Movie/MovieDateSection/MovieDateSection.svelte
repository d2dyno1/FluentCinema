<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { MovieApiContext } from "../../../api/MovieApiContext";
    import type { MovieType } from "$data/MovieType";
    import moment from "moment";

    export let movie: MovieApiContext;
    export let screeningDates: TableDateItem[] = [];

    function getFriendlyTypeName(movieType: MovieType): string {
        return movieType;
    }
</script>

{#if screeningDates}
    <div class="wrapper">
        {#each screeningDates as item}
            <div class="column">
                <div class="column-header">
                    {item.dayName}
                </div>
                <hr class="divider"/>
                <div class="column-dates">
                    {#if item.dates}
                        {#each item.dates as dateWithType}
                            <div class="item-date">
                                {moment(dateWithType.date).format('hh:mm')} {getFriendlyTypeName(dateWithType.type)}
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