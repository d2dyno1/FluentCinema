<script lang="ts">
    import { onMount } from "svelte";
    import { ProgressRing, TextBlock } from "fluent-svelte";
    import { ReservationApiContext } from "$api/ReservationApiContext";
    import { Reservation } from "$lib";

    let reservations: Promise<ReservationApiContext[]>;

    onMount(async () => {
        reservations = ReservationApiContext.getAll();
    });
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
            <TextBlock>You don't have any reservations.</TextBlock>
        {/if}
        {#each response as reservation}
            <Reservation {reservation}/>
        {/each}
    {/await}
{/if}

<style lang="scss">
    @use "reservations";
</style>