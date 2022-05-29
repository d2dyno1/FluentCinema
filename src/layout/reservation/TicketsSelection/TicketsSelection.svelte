<script lang="ts">
    import { TicketCard } from "$lib";

    export let childrenTickets: number = 0;
    export let adultTickets: number = 0;
    export let seniorTickets: number = 0;
    export let maxSeats: number;

    const childrenTicketPrice = 100;
    const adultTicketPrice = 100;
    const seniorTicketPrice = 100;

    $: maxSeatsAvailable = maxSeats - (childrenTickets + adultTickets + seniorTickets);
    $: totalPrice = (childrenTickets * childrenTicketPrice) + (adultTickets * adultTicketPrice) + (seniorTickets * seniorTicketPrice);
</script>

<div class="wrapper">
    <div class="tickets-list">
        <TicketCard maxTickets={maxSeatsAvailable} tickets={childrenTickets} title="Reduced ticket" subtitle="Children below 16"/>
        <TicketCard maxTickets={maxSeatsAvailable} tickets={adultTickets} title="Normal ticket" subtitle="All adults, children age 16 and above"/>
        <TicketCard maxTickets={maxSeatsAvailable} tickets={seniorTickets} title="Senior ticket" subtitle="Senior, age 60 and above"/>
    </div>
    <div class="description">
        <div class="total-title">
            Total: {totalPrice}
        </div>
        <p class="ticket-prices-list">
            Reduced ticket: {childrenTickets * childrenTicketPrice}
            <br/>
            Normal ticket: {adultTickets * adultTicketPrice}
            <br/>
            Senior ticket: {seniorTickets * seniorTicketPrice}
        </p>
    </div>
</div>

<style lang="scss">
    @use "TicketsSelection";
</style>