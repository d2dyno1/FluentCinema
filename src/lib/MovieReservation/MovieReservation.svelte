<script lang="ts">
    import type { Reservation } from "$api/Reservation";
    import { TextBlock } from "fluent-svelte";
    import moment from "moment";

    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_month_24_filled.svg?raw";
    import ClockIcon from "@fluentui/svg-icons/icons/clock_24_filled.svg?raw";

    export let reservation: Reservation;
</script>

<div class="reservation">
    <picture>
        <img class="movie-poster" alt="img" src="/api/movie/{reservation.movieId}/poster">
    </picture>
    <TextBlock variant="bodyLarge">{reservation.movieName}</TextBlock>
    <div>
        {@html CalendarIcon}
        <TextBlock>{moment(reservation.date).format("DD/MM/YY")}</TextBlock>
    </div>
    <div>
        {@html ClockIcon}
        <TextBlock>{moment(reservation.date).format("h:mm")}</TextBlock>
    </div>
    <div>
<!--        chair icon -->
        <TextBlock>{reservation.seat}</TextBlock>
    </div>
</div>

<style lang="scss">
    @use "MovieReservation";
</style>