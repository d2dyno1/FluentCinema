<script lang="ts">
    import { Button } from "fluent-svelte";
    import type { MovieCard } from "$data/cards";

    export let cards: MovieCard[] = [];
    export let currentCard: MovieCard = cards[0];

    function cardClicked(e: MovieCard): void
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
            <button on:click={() => cardClicked(card)} class="card">
                <img class="small-banner-img" alt={card.name} src={card.image}>
                <div class="card-name">
                    <h4>
                        {card.name}
                    </h4>
                </div>
            </button>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>