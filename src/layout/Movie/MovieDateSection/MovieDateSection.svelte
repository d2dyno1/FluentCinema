<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { MovieApiContext } from "../../../api/MovieApiContext";
    import { ScreeningType } from "$data/ScreeningType";
    import moment from "moment";

    export let movie: MovieApiContext;
    export let screeningDates: TableDateItem[] = [];

    function getFriendlyTypeName(movieType: ScreeningType): string {
        switch (movieType.toString())
        {
            case ScreeningType.SUBTITLES_2D: return "Sub 2D";
            case ScreeningType.SUBTITLES_3D: return "Sub 3D";

            case ScreeningType.DUBBING_2D: return "Dub 2D";
            case ScreeningType.DUBBING_3D: return "Dub 3D";

            default: return "";
        }
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