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
    import { ProgressiveFormSection, PromiseButton } from "$lib";
    import { Button, ContentDialog, Expander, TextBlock } from "fluent-svelte";
    import { accountSession } from "$/stores";
    import { goto } from "$app/navigation";
    import { dev } from "$app/env";

    import MapIcon from "@fluentui/svg-icons/icons/map_24_filled.svg?raw";
    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_clock_24_filled.svg?raw";
    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";
    import SeatsIcon from "@fluentui/svg-icons/icons/people_audience_24_filled.svg?raw";
    import SummaryIcon from "@fluentui/svg-icons/icons/multiselect_ltr_24_filled.svg?raw";
    import { Reservation } from "$api/Reservation";

    export let cinemas: Cinema[];
    export let movie: Movie;
    export let screening: Screening;
    let price: number = 0;

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
    $: totalTickets = +reducedTickets + +normalTickets + +seniorTickets;
    $: console.log(totalTickets);

    let selectedSeats: number[] = [];

    let isError = false;
    let errorMessage: string;

    async function finishReservation(): Promise<void> {
        if (selectedSeats.length < totalTickets) {
            isError = true;
            errorMessage = "You need to select all seats.";
            return;
        }
        let response = await Reservation.create(screening.id, selectedSeats);
        if (response.success) {
            await goto("/account/reservations");
        } else if (response.message) {
            isError = true;
            errorMessage = response.message;
        }
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

<ContentDialog bind:open={isError} title="Error">
    <TextBlock>{errorMessage}</TextBlock>
    <Button slot="footer" on:click={() => isError = false}>Close</Button>
</ContentDialog>

<div class="wrapper">
    <div class="title">
        {movie.name}: {movie.description}
    </div>

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
                        <TicketsSelection bind:screening={screening} bind:totalPrice={price}
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
                    {#if screening != null && totalTickets > 0}
                        {#key screening}
                            <SeatSelection bind:selectedSeats={selectedSeats} bind:maxSelection={totalTickets} {screening}/>
                        {/key}
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
            <ProgressiveFormSection bind:currentSection={seatSelectionExpanded} useCustomButton={true}>
                <svelte:fragment slot="content">
                    {#if selectedSeats?.length > 0}
                        <SummarySection {selectedSeats} bind:totalPrice={price} {reducedTickets} {normalTickets} {seniorTickets} bind:movie={movie} bind:screening={screening}/>
                    {/if}
                </svelte:fragment>
                <PromiseButton slot="button" onClick={() => finishReservation()}>Make reservation</PromiseButton>
            </ProgressiveFormSection>
        </svelte:fragment>
    </Expander>
</div>

<style lang="scss">
    @use "reservation";
</style>