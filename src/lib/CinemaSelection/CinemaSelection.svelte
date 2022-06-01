<script lang="ts">
    import { onMount } from "svelte";
    import { Cinema } from "$api/Cinema";
    import LocationIcon from "@fluentui/svg-icons/icons/location_48_filled.svg?raw";
    import { TextBlock } from "fluent-svelte";

    export let cinemas: Cinema[];
    export let selectedCinema: Cinema;

    let mapContainer;

    function initMap(): void {
        let map = new google.maps.Map(mapContainer, {
            center: { lat: cinemas[0].latitude, lng: cinemas[0].longitude },
            zoom: 8
        });

        for (let cinema of cinemas) {
            let position = { lat: cinema.latitude, lng: cinema.longitude };
            new google.maps.Marker({ position, map }).addListener("click", () => selectedCinema = cinema);
        }
    }

    onMount(async () => {
        window.initMap = initMap;
        eval(await (await fetch("https://maps.googleapis.com/maps/api/js?key=AIzaSyBunHici73nuGFjNgAB8cRoNvqK1nOGIxI&callback=initMap&v=weekly")).text());
    })
</script>

<div bind:this={mapContainer} id="map"></div>
{#if selectedCinema != null}
    <div class="cinema-info">
        {@html LocationIcon}
        <TextBlock>{selectedCinema.address}</TextBlock>
    </div>
{/if}

<style lang="scss">
    @use "CinemaSelection";
</style>