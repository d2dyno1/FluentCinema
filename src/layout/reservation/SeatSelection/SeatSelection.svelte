<script lang="ts">
    import { Seat } from "$lib";

    export let seatRowCount: number;
    export let seatRowLength: number;
    export let reservedSeats: number[];
    export let selectedSeats: number[] = [];
    export let maxSelection = 0;

    let seats: number[][] = [];

    let seat = 1;
    for (let i = 0; i < seatRowCount; i++) {
        seats.push([]);
        for (let j = 0; j < seatRowLength; j++) {
            seats[i].push(seat++);
        }
    }

    function addSelectedSeat(seat: number) {
        if (selectedSeats.length >= maxSelection) {
            selectedSeats.shift();
        }
        if (maxSelection != 0 && !selectedSeats.includes(seat)) {
            selectedSeats.push(seat);
        }
    }

</script>

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

<style lang="scss">
    @use "SeatSelection";
</style>