<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import { Cinema } from "$api/Cinema";
    import { Movie } from "$api/Movie";
    import { MovieType } from "$data/MovieType";

    export const load: Load = async ({ session, fetch, params }) => {
        let movie = await Movie.getFromId(fetch, params.id);
        if (!movie || movie.type == MovieType.SERIES) {
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
    import type { Screening } from "$api/Screening";
    import { CinemaSelection, ScreeningDateSelection, TicketsSelection, SeatSelection, SummarySection } from "$layout";
    import { ProgressiveFormSection } from "$lib";
    import { Button, ContentDialog, Expander } from "fluent-svelte";
    import { accountSession } from "$/stores";
    import { goto } from "$app/navigation";
    import { dev } from "$app/env";

    import MapIcon from "@fluentui/svg-icons/icons/map_24_filled.svg?raw";
    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_clock_24_filled.svg?raw";
    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";
    import SeatsIcon from "@fluentui/svg-icons/icons/people_audience_24_filled.svg?raw";
    import SummaryIcon from "@fluentui/svg-icons/icons/multiselect_ltr_24_filled.svg?raw";

    export let cinemas: Cinema[];
    export let movie: Movie;
    export let screening: Screening;

    const DEBUG = dev;

    let selectedCinema: Cinema;

    let locationSelectionExpanded = true;
    let dateSelectionExpanded = false;
    let bookingSelectionExpanded = false;
    let seatSelectionExpanded = false;
    let summarySectionExpanded = false;

    let reducedTickets: number = 0;
    let normalTickets: number = 0;
    let seniorTickets: number = 0;

    let selectedSeats: number[] = [];

    function finishReservation() {
        // TODO
    }

</script>

<ContentDialog title="Invalid operation" open={!$accountSession.isLoggedIn} closable={false}>
    You need to be logged-in in order to make a reservation.
    <Button variant="accent" slot="footer" on:click={() => goto("/")}>Home</Button>
</ContentDialog>

{#if !DEBUG}
<ContentDialog title="Invalid operation" open={$accountSession.isLoggedIn && !$accountSession.user?.isVerified} closable={false}>
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
            {@html CalendarIcon}
        </svelte:fragment>
        Date
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={dateSelectionExpanded} bind:nextSection={bookingSelectionExpanded}>
                <svelte:fragment slot="content">
                    {#if selectedCinema != null}
                        <ScreeningDateSelection cinema={selectedCinema} {movie} bind:selectedScreening={screening}/>
                    {/if}
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
                    {#if screening != null}
                        <TicketsSelection {screening}
                                          bind:reducedTickets={reducedTickets}
                                          bind:normalTickets={normalTickets}
                                          bind:seniorTickets={seniorTickets}/>
                    {/if}
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
            <ProgressiveFormSection bind:currentSection={seatSelectionExpanded} bind:nextSection={summarySectionExpanded}>
                <svelte:fragment slot="content">
                    {#if screening != null && (+reducedTickets + +normalTickets + +seniorTickets) > 0}
                        <SeatSelection bind:selectedSeats={selectedSeats} maxSelection={(+reducedTickets + +normalTickets + +seniorTickets)} {screening}/>
                    {/if}
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>

    <Expander bind:expanded={summarySectionExpanded}>
        <svelte:fragment slot="icon">
            {@html SummaryIcon}
        </svelte:fragment>
        Summary
        <svelte:fragment slot="content">
            <ProgressiveFormSection bind:currentSection={summarySectionExpanded} buttonText="Make reservation" continueCallback={finishReservation}>
                <svelte:fragment slot="content">
                    <SummarySection {selectedSeats} totalPrice={-1} {reducedTickets} {normalTickets} {seniorTickets} {movie} {screening}/>
                </svelte:fragment>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>
</div>

<style lang="scss">
    @use "reservation";
</style>