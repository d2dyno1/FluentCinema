<script lang="ts">
    import { onMount } from "svelte";
    import { ReservationApiContext } from "$api/ReservationApiContext";
    import { Reservation } from "$lib";
    import { ProgressRing, TextBlock } from "fluent-svelte";

    let reservations: Promise<ReservationApiContext[]>;

    onMount(async () => {
        reservations = ReservationApiContext.getAll();
    })
</script>

{#if reservations == null}
    <ProgressRing size={64}/>
{:else}
    {#await reservations}
        <ProgressRing size={64}/>
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