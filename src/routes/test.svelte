<script lang="ts">
    import SeatSelection from "$layout/reservation/SeatSelection/SeatSelection.svelte";
</script>

<SeatSelection seatRowCount={10} seatRowLength={20} reservedSeats={[1, 21, 41, 61, 81, 101, 121, 141, 161, 181, 2, 22, 42, 62, 82, 102, 122, 142, 162]}/>