<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { Cinema } from "$api/Cinema";
    import { Movie } from "$api/Movie";

    export const load: Load = async ({ session, fetch, params }) => {
        let movie = await Movie.getFromId(fetch, params.id);
        if (!movie) {
            return {
                status: 302,
                redirect: "/"
            };
        }
        return {
            status: 200,
            props: {
                cinemas: await Cinema.getList(fetch),
                movie
            }
        };
    }
</script>

<script lang="ts">
    import { CinemaSelection, TicketsSelection, SeatSelection } from "$layout";
    import { ProgressiveFormSection } from "$lib";
    import { Button, ContentDialog, Expander } from "fluent-svelte";

    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";
    import SeatsIcon from "@fluentui/svg-icons/icons/people_audience_24_filled.svg?raw";
    import DetailsIcon from "@fluentui/svg-icons/icons/multiselect_ltr_24_filled.svg?raw";
    import MapIcon from "@fluentui/svg-icons/icons/map_24_filled.svg?raw";
    import { accountSession } from "$/stores";
    import { goto } from "$app/navigation";
    import { dev } from "$app/env";

    export let cinemas: Cinema[];
    export let movie: Movie;

    const DEBUG = dev;

    let selectedCinema: Cinema;

    let locationSelectionExpanded = true;
    let dateSelectionExpanded = false;
    let bookingSelectionExpanded = false;
    let seatSelectionExpanded = false;

    let reducedTickets: number = 0;
    let normalTickets: number = 0;
    let seniorTickets: number = 0;

    function finishReservation() {
        // TODO
    }

</script>

<ContentDialog title="Error" open={!$accountSession.isLoggedIn}>
    You need to be logged-in in order to make a reservation.
    <Button variant="accent" slot="footer" on:click={() => goto("/")}>Home</Button>
</ContentDialog>

{#if !DEBUG}
<ContentDialog title="Error" open={$accountSession.isLoggedIn && !$accountSession.user.isVerified}>
    You need to verify your e-mail address in order to make a reservation.
    <Button variant="accent" slot="footer" on:click={() => goto("/account/preferences")}>Verify account</Button>
</ContentDialog>
{/if}

<div class="wrapper">
    <Expander bind:expanded={locationSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html MapIcon}
        </svelte:fragment>
        Place
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={locationSelectionExpanded} bind:nextSection={dateSelectionExpanded}>
                <svelte:fragment slot="content">
                    <CinemaSelection {cinemas} bind:selectedCinema={selectedCinema}/>
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>

    <Expander bind:expanded={dateSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html DetailsIcon}
        </svelte:fragment>
        Details
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={dateSelectionExpanded} bind:nextSection={bookingSelectionExpanded}>
                <svelte:fragment slot="content">
                    What did you think was going to happen? 😆
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>

    <Expander bind:expanded={bookingSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html TicketIcon}
        </svelte:fragment>
        Tickets
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={bookingSelectionExpanded} bind:nextSection={seatSelectionExpanded}>
                <svelte:fragment slot="content">
                    <TicketsSelection maxSeats={200-29}
                                      bind:reducedTickets={reducedTickets}
                                      bind:normalTickets={normalTickets}
                                      bind:seniorTickets={seniorTickets}/>
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>

    <Expander bind:expanded={seatSelectionExpanded}>
        <svelte:fragment slot="icon">
            {@html SeatsIcon}
        </svelte:fragment>
        Seats
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={dateSelectionExpanded} buttonText="Finish" continueCallback={finishReservation}>
                <svelte:fragment slot="content">
                    <SeatSelection
                            maxSelection={(+reducedTickets + +normalTickets + +seniorTickets)}
                            seatRowCount={20}
                            seatRowLength={10}
                            reservedSeats={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 25, 29]}/>
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>
</div>

<style lang="scss">
    @use "reservation";
</style>