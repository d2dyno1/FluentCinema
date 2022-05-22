<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { MovieApiContext } from "../../../api/MovieApiContext";

    export let movie: MovieApiContext;
    export let screeningDates: TableDateItem[][];
</script>

{#if screeningDates}
    <div>
        {#each screeningDates as column}
            <div>
                {#each column as row}
                    <div>
                        {row.date.getDay()}
                        {row.date.toLocaleTimeString()}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    @use "MovieDateSection";
</style>