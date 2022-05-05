<script lang="ts">
    import { Button, Tooltip } from "fluent-svelte";
    import { MovieCard } from "$lib";
    import type { MovieData } from "$data/movies";

    export let cards: MovieData[] = [];
    export let currentCard: MovieData = cards[0];

    function cardClicked(e: MovieData): void
    {
        currentCard = e;
    }
</script>

<div class="main-content">
    <div class="hero-section">
        <picture>
            <img class="banner-img" alt={currentCard.name} src={currentCard.image}>
        </picture>
        <div class="hero-left">
            <h1>{currentCard.name}</h1>
            <p class="banner-subtitle">{currentCard.description}</p>
            <Button class="details-button">See details</Button>
        </div>
    </div>
    <div class="cards">
        {#each cards as card}
            <MovieCard
                on:click={() => cardClicked(card)}
                selected={currentCard == card}
                name={card.name}
                image={card.image} />
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>