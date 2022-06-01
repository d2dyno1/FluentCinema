<script lang="ts">
    import { Seat } from "$lib";
    import { Screening } from "$api/Screening";
    import { onMount } from "svelte";

    export let screening: Screening;
    export let selectedSeats: number[];
    export let maxSelection = 0;

    let reservedSeats: number[] = [];
    let seats: number[][] = [];

    onMount(async () => {
        reservedSeats = await screening.getReservedSeats();
    });

    let seat = 1;
    $: if (screening != null) {
        seat = 1;
        seats = [];
        selectedSeats = [];
        for (let i = 0; i < screening.seatRowCount; i++) {
            seats.push([]);
            for (let j = 0; j < screening.seatRowLength; j++) {
                seats[i].push(seat++);
            }
        }
    }

    function addSelectedSeat(seat: number) {
        if (maxSelection != 0 && !selectedSeats.includes(seat)) {
            selectedSeats.push(seat);
        }
        selectedSeats = [...selectedSeats];
    }

    $: if (selectedSeats.length > maxSelection) {
        selectedSeats.splice(0, selectedSeats.length - maxSelection);
        selectedSeats = [...selectedSeats];
    }
</script>

{#if seats.length > 0}
    <div class="seat-selection">
        <div class="seats">
            {#each seats as row}
                <div class="row">
                    {#each row as seat}
                        <div on:click={() => addSelectedSeat(seat)}>
                            <Seat number={seat} selected={selectedSeats.includes(seat)} reserved={reservedSeats.includes(seat)}/>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
        <div class="legend">
            <div class="seat">
                <div class="seat-color black"/>Seat
            </div>
            <div class="seat">
                <div class="seat-color red"/>Reserved seat
            </div>
            <div class="seat">
                <div class="seat-color blue"/>Selected seat
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "SeatSelection";
</style>