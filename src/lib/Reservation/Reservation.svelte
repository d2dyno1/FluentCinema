<script lang="ts">
    import { ReservationApiContext } from "$api/ReservationApiContext";
    import { TextBlock } from "fluent-svelte";
    import moment from "moment";

    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_month_24_filled.svg?raw";
    import ClockIcon from "@fluentui/svg-icons/icons/clock_24_filled.svg?raw";

    export let reservation: ReservationApiContext;
</script>

<div class="reservation">
    <picture>
        <img class="movie-poster" alt="img" src="/api/cinema/movie/{reservation.screening.movie.id}/poster">
    </picture>
    <TextBlock variant="bodyLarge">{reservation.screening.movie.name}</TextBlock>
    <div>
        {@html CalendarIcon}
        <TextBlock>{moment(reservation.screening.start).format("DD/MM/YY")}</TextBlock>
    </div>
    <div>
        {@html ClockIcon}
        <TextBlock>{moment(reservation.screening.start).format("h:mm")}</TextBlock>
    </div>
    <div>
<!--        chair icon -->
        <TextBlock>{reservation.seat}</TextBlock>
    </div>
</div>

<style lang="scss">
    @use "Reservation";
</style>