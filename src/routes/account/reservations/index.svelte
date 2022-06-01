<script lang="ts">
    import { ProgressRing, TextBlock } from "fluent-svelte";
    import { MovieReservation } from "$lib";
    import { Reservation } from "$api/Reservation";

    export let reservations: Promise<Reservation[]> = Reservation.getAll();
</script>

{#if reservations == null}
    <ProgressRing size={64}/>
{:else}
    {#await reservations}
        <div class="progress-ring-overlay">
            <ProgressRing size={64}/>
        </div>
    {:then response}
        {#if response.length == 0}
            <div class="no-reservations-text">
                <TextBlock>You don't have any reservations.</TextBlock>
            </div>
        {/if}
        {#each response as reservation}
            <MovieReservation {reservation}/>
        {/each}
    {/await}
{/if}

<style lang="scss">
    @use "reservations";
</style>