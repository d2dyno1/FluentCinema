<script lang="ts">
    import type { TableDateItem } from "$/data/table";
    import type { Movie } from "$db/movie/Movie";

    export let movie: Movie;
    export let screeningDates: TableDateItem[][] = [[]];

    const columns: TableDateItem[][] = [
        [ {date: new Date(10) }, {date: new Date("2022-01-01T14:50.0") } ],
        [ {date: new Date("2022-01-01T14:50.0") }, ],
    ];
</script>

<div>
    {#each columns as column}
        <div>
            {#each column as row}
                <div>
                    {row.date.toTimeString()}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style lang="scss">
    @use "MovieDateSection";
</style>