<script lang="ts">
    import type { TableDateItem } from "$data/table";
    import { ScreeningType } from "$data/ScreeningType";
    import { TextBlock } from "fluent-svelte";
    import moment from "moment";

    export let screeningDates: TableDateItem[] = [];

    let innerWidth = 869;

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

<svelte:window bind:innerWidth />

{#if screeningDates}
<div class="wrapper">
    <div class="title">
        <TextBlock variant="title">Available on</TextBlock>
    </div>
    <div class="calendar-wrapper">
        {#each screeningDates as item, i}
            {#if i != 0} <!-- Skip the first divider -->
                <hr class="vertical-divider"/>
            {/if}
            <div class="column">
                <div class="column-header">
                    {#if innerWidth > 868}
                        {item.dayName}
                    {:else}
                        {item.dayName.substring(0, 3)}
                    {/if}
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
</div>

{/if}

<style lang="scss">
    @use "MovieDateSection";
</style>