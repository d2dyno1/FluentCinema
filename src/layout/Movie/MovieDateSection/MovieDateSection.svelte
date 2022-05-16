<script lang="ts">
    import type { Movie } from "$db/movie/Movie";
    import SvelteTable from "svelte-table";

    export let movie: Movie;

    const rows: [] = [
        /** data (example below) */
        { date: "ABC" }
    ];
    const columns: [] = [
        /** columns config (example below) */
    ];
</script>

<div>
    <SvelteTable rows={rows} columns={columns}/>
</div>

<style lang="scss">
    @use "MovieDateSection";
</style>