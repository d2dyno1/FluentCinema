<script lang="ts">
    import { TicketCard } from "$lib";

    export let childrenTickets: number = 0;
    export let adultTickets: number = 0;
    export let seniorTickets: number = 0;
    export let maxSeats: number;

    $: maxSeatsAvailable = maxSeats - (childrenTickets + adultTickets + seniorTickets);
</script>

<div class="wrapper">
    <TicketCard maxTickets={maxSeatsAvailable} tickets={childrenTickets} title="Reduced ticket" subtitle="Children below 16"/>
    <TicketCard maxTickets={maxSeatsAvailable} tickets={adultTickets} title="Normal ticket" subtitle="All adults"/>
    <TicketCard maxTickets={maxSeatsAvailable} tickets={seniorTickets} title="Senior ticket" subtitle="Senior, 60 and above"/>
</div>

<style lang="scss">
    @use "TicketsSelection";
</style>