<script lang="ts">
    import { TicketCard } from "$lib";
    import { Screening } from "$api/Screening";
    import { onMount } from "svelte";

    export let screening: Screening;
    export let reducedTickets: number = 0;
    export let normalTickets: number = 0;
    export let seniorTickets: number = 0;

    let reservedSeats: number = 0;
    $: maxSeats = screening.seatRowLength * screening.seatRowCount - reservedSeats;

    const reducedTicketPrice = 16.75;
    const normalTicketPrice = 21.99;
    const seniorTicketPrice = 16.75;

    const currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    });

    onMount(async () => {
        reservedSeats = (await screening.getReservedSeats()).length;
    })

    $: maxSeatsAvailable = maxSeats - (reducedTickets + normalTickets + seniorTickets);
    $: totalPrice = (reducedTickets * reducedTicketPrice) + (normalTickets * normalTicketPrice) + (seniorTickets * seniorTicketPrice);
</script>

<div class="wrapper">
    <div class="tickets-list">
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={reducedTickets} title="Reduced ticket" subtitle="Children below 16"/>
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={normalTickets} title="Normal ticket" subtitle="All normals, reduced age 16 and above"/>
        <TicketCard bind:maxTickets={maxSeatsAvailable} bind:tickets={seniorTickets} title="Senior ticket" subtitle="Senior, age 60 and above"/>
    </div>
    <div class="description">
        <div class="total-title">
            Total: {currencyFormatter.format(totalPrice)}
        </div>
        <p class="ticket-prices-list">
            Reduced ticket: {currencyFormatter.format(reducedTickets * reducedTicketPrice)}
            <br/>
            Normal ticket: {currencyFormatter.format(normalTickets * normalTicketPrice)}
            <br/>
            Senior ticket: {currencyFormatter.format(seniorTickets * seniorTicketPrice)}
        </p>
    </div>
</div>

<style lang="scss">
    @use "TicketsSelection";
</style>