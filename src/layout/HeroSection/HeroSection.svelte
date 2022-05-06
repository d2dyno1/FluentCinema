<script lang="ts">
    import { fade } from "svelte/transition";
    import { Button } from "fluent-svelte";
    import { MovieCard } from "$lib";
    import type { MovieData } from "$data/movies";

    export let cards: MovieData[] = [];
    export let currentCard: MovieData = cards[0];
    $: currentIndex = cards.indexOf(currentCard);

    function cardClicked(e: MovieData): void
    {
        currentCard = e;
    }

    function detailsClicked(e: MovieData): void
    {
    }
</script>

<div class="main-content">
    <div class="hero-section">
        <picture>
            {#each [cards[currentIndex]] as src (currentIndex)}
                <img transition:fade src={currentCard.image} alt={currentCard.name} class="banner-img">
            {/each}
        </picture>
        <div class="hero-left">
            <h1>{currentCard.name}</h1>
            <p class="banner-subtitle">{currentCard.description}</p>
            <Button on:click={() => detailsClicked(currentCard)} class="details-button">See details</Button>
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
                image={card.image} />
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>