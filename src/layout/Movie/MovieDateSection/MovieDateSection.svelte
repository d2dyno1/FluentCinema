<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { Movie } from "$db/movie/Movie";

    export let movie: Movie;
    export let screeningDates: TableDateItem[][] = [];
</script>

{#if screeningDates}
    <div>
        {#each screeningDates as column}
            <div class="column">
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