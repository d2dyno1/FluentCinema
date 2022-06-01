<script lang="ts">
    import type { Cinema } from "$api/Cinema";
    import LocationIcon from "@fluentui/svg-icons/icons/location_48_filled.svg?raw";
    import { ProgressRing, TextBlock } from "fluent-svelte";
    import { onMount } from "svelte";

    export let cinemas: Cinema[];
    export let selectedCinema: Cinema;

    let mapContainer: any;
    let ready = false;

    function initMap() {
        let map = new google.maps.Map(mapContainer, {
            center: { lat: cinemas[0].latitude, lng: cinemas[0].longitude },
            zoom: 8
        });

        for (let cinema of cinemas) {
            let position = { lat: cinema.latitude, lng: cinema.longitude };
            new google.maps.Marker({ position, map }).addListener("click", () => selectedCinema = cinema);
        }
    }

    onMount(() => {
        window.initMap = initMap;
        ready = true;
    });
</script>

{#if ready}
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBunHici73nuGFjNgAB8cRoNvqK1nOGIxI&callback=initMap&v=weekly"/>
{/if}

<div class="wrapper">
    <div class="cinema-info">
        <div class="mark-icon">
            {@html LocationIcon}
        </div>
        <div>
            {#if selectedCinema}
                <TextBlock>{selectedCinema.address}</TextBlock>
            {:else}
                <TextBlock>No cinema selected</TextBlock>
            {/if}
        </div>
    </div>
    {#if ready}
        <div bind:this={mapContainer} id="map"/>
    {:else}
        <div class="progress-ring-overlay">
            <ProgressRing/>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "CinemaSelection";
</style>