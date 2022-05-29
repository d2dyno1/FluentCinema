<script lang="ts">
    import { NumberBox } from "fluent-svelte";

    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";

    export let childrenTickets: number = 0;
    export let maxSeats: number;

    $: maxSeatsAvailalbe = maxSeats - (childrenTickets + 0);
</script>

<div class="wrapper">
    <div class="ticket-frame">
        <div class="ticket-title">
            {@html TicketIcon}
            Reduced ticket (Children only)
        </div>
        <NumberBox inline={true} min={0} max={maxSeatsAvailalbe} value={childrenTickets} />
    </div>
    <div class="ticket-frame">
        <div class="ticket-title">
            {@html TicketIcon}
            Normal ticket
        </div>
        <NumberBox inline={true} min={0} max={maxSeatsAvailalbe} value={childrenTickets} />
    </div>
</div>

<style lang="scss">
    @use "TicketsSelection";
</style>