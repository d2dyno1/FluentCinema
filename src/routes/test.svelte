<script lang="ts">
    import { TicketsSelection, SeatSelection } from "$layout";
    import { Expander } from "fluent-svelte";

    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";
    import SeatsIcon from "@fluentui/svg-icons/icons/people_audience_24_filled.svg?raw";

    let bookingSelectionExpanded = true;
    let seatSelectionExpanded = false;
</script>


<div class="wrapper">
    <Expander bind:expanded={bookingSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html TicketIcon}
        </svelte:fragment>
        Tickets
        <svelte:fragment slot="content">
            <TicketsSelection/>
        </svelte:fragment>
    </Expander>

    <Expander bind:expanded={seatSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html SeatsIcon}
        </svelte:fragment>
        Seat selection
        <svelte:fragment slot="content">
            <SeatSelection 
                seatRowCount={20}
                seatRowLength={10} 
                reservedSeats={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 25, 29]}/>
        </svelte:fragment>
    </Expander>
    </div>

<style lang="scss">
    @use "test";
</style>