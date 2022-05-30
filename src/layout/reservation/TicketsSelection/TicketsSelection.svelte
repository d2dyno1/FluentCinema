<script lang="ts">
    import { TicketCard } from "$lib";

    export let childrenTickets: number = 0;
    export let adultTickets: number = 0;
    export let seniorTickets: number = 0;
    export let maxSeats: number;

    const childrenTicketPrice = 16.75;
    const adultTicketPrice = 21.99;
    const seniorTicketPrice = 16.75;

    const currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    });

    $: maxSeatsAvailable = maxSeats - (childrenTickets + adultTickets + seniorTickets);
    $: totalPrice = (childrenTickets * childrenTicketPrice) + (adultTickets * adultTicketPrice) + (seniorTickets * seniorTicketPrice);
</script>

<div class="wrapper">
    <div class="tickets-list">
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={childrenTickets} title="Reduced ticket" subtitle="Children below 16"/>
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={adultTickets} title="Normal ticket" subtitle="All adults, children age 16 and above"/>
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={seniorTickets} title="Senior ticket" subtitle="Senior, age 60 and above"/>
    </div>
    <div class="description">
        <div class="total-title">
            Total: {currencyFormatter.format(totalPrice)}
        </div>
        <p class="ticket-prices-list">
            Reduced ticket: {currencyFormatter.format(childrenTickets * childrenTicketPrice)}
            <br/>
            Normal ticket: {currencyFormatter.format(adultTickets * adultTicketPrice)}
            <br/>
            Senior ticket: {currencyFormatter.format(seniorTickets * seniorTicketPrice)}
        </p>
    </div>
</div>

<style lang="scss">
    @use "TicketsSelection";
</style>