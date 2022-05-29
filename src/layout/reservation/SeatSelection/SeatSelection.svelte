<script lang="ts">
    import Seat from "$lib/Seat/Seat.svelte";

    export let seatRowCount: number;
    export let seatRowLength: number;
    export let reservedSeats: number[];
    export let selectedSeat: number;

    let seats: number[][] = [];

    let seat = 1;
    for (let i = 0; i < seatRowCount; i++) {
        seats.push([]);
        for (let j = 0; j < seatRowLength; j++) {
            seats[i].push(seat++);
        }
    }
</script>

<div class="seat-selection">
    <div class="seats">
        {#each seats as row}
            <div class="row">
                {#each row as seat}
                    <div on:click={() => selectedSeat = seat}>
                        <Seat number={seat} selected={selectedSeat == seat} reserved={reservedSeats.indexOf(seat) != -1}/>
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

<style lang="scss">
    @use "SeatSelection";
</style>