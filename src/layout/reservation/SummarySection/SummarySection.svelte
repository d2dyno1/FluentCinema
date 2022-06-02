<script lang="ts">
    import type { Movie } from "$api/Movie";
    import type { Screening } from "$api/Screening";
    import { getFriendlyScreeningTypeName } from "$lib/utils";
    import moment from "moment";
    
    export let movie: Movie;
    export let screening: Screening;
    export let reducedTickets: number;
    export let normalTickets: number;
    export let seniorTickets: number;
    export let totalPrice: number;
    export let selectedSeats: number[] = [];

    const currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    });
</script>

<div class="wrapper">
    <div class="column">
        <div class="column-item">
            <div>{reducedTickets}</div>
            Reduced ticket(s)
        </div>
        <div class="column-item">
            <div>{normalTickets}</div>
            Normal ticket(s)
        </div>
        <div class="column-item">
            <div>{seniorTickets}</div>
            Senior ticket(s)
        </div>
        <div class="column-item">
            <div>{currencyFormatter.format(totalPrice)}</div>
            Price
        </div>
    </div>
    <div class="column">
        <div class="column-item">
            <div>{moment(screening?.start).format('DD.MM.yyyy')}</div>
            Date
        </div>
        <div class="column-item">
            <div>{moment(screening?.start).format('HH:mm')}</div>
            Time
        </div>
        <div class="column-item">
            <div>{movie?.length}min</div>
            Length
        </div>
        <div class="column-item">
            <div>{moment(screening?.start).add(movie?.length, 'minutes').format('HH:mm')}</div>
            End time
        </div>
    </div>
    <div class="column">
        <div class="column-item">
            <div class="text-overflow">{selectedSeats.join(', ')}</div>
            Seats
        </div>
        <div class="column-item">
            <div>{getFriendlyScreeningTypeName(screening?.type)}</div>
            Type
        </div>
    </div>
</div>

<style lang="scss">
    @use "SummarySection";
</style>