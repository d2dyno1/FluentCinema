<script lang="ts">
    import type { CinemaLocation } from "$data/CinemaLocation";
    import { ComboBox } from "fluent-svelte";

    export let locations: CinemaLocation[];
    export let selectedIndex: number = 0;

    $: comboboxLocations = locations.map((x, i) => ({ name: x.name, value: i }) as any);
</script>

<div class="wrapper">
    <div class="map"/>
    <div class="description">
        <ComboBox placement="bottom" items={comboboxLocations} bind:value={selectedIndex}/>
        <p class="location-details">
            City: {locations[selectedIndex].city}
            <br/>
            Street: {locations[selectedIndex].street}
        </p>
    </div>
</div>

<style lang="scss">
    @use "LocationSelection";
</style>