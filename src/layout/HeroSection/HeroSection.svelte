<script lang="ts">
    import { fade } from "svelte/transition";
    import { Button } from "fluent-svelte";
    import { MovieCard } from "$lib";
    import {MovieResponse} from "$data/response/MovieResponse";

    export let cards: MovieResponse[] = [];
    export let currentCard: MovieResponse = cards[0];
    $: currentIndex = cards.indexOf(currentCard);

    function cardClicked(e: MovieResponse): void
    {
        currentCard = e;
    }

    function detailsClicked(e: MovieResponse): void
    {
    }
</script>

<div class="main-content">
    <div class="hero-section">
        <picture>
            {#each [cards[currentIndex]] as src (currentIndex)}
                <img transition:fade src="/api/cinema/movie/{currentCard.id}/banner" alt={currentCard.name} class="banner-img">
            {/each}
        </picture>
        <div class="hero-left">
            <h1>{currentCard.name}</h1>
            <p class="banner-subtitle">{currentCard.description}</p>
            <Button class="details-button" on:click={() => detailsClicked(currentCard)}>See details</Button>
        </div>
        <div class="hero-overlay"></div>
    </div>
    <div class="cards">
        {#each cards as card}
            <MovieCard
                on:click={() => cardClicked(card)}
                on:dblclick={() => { cardClicked(card); detailsClicked(card); }}
                selected={currentCard == card}
                name={card.name}
                image="/api/cinema/movie/{card.id}/banner"/>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>