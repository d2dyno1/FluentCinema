<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { Movie } from "$db/movie/Movie";

    export let movie: Movie;
    export let screeningDates: TableDateItem[][];
</script>

<div>
    {#if screeningDates} 
        {#each screeningDates as column}
            <div>
                {#each column as row}
                    <div>
                        {row.date.toTimeString()}
                    </div>
                {/each}
            </div>
        {/each}
    {/if}
</div>

<style lang="scss">
    @use "MovieDateSection";
</style>