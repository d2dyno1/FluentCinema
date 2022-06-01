<script lang="ts">
    import { fade } from "svelte/transition";
    import { Button } from "fluent-svelte";
    import { MovieCard } from "$lib";
    import type { Movie } from "$api/Movie";
    import { goto } from "$app/navigation";

    export let cards: Movie[] = [];
    export let currentCard: Movie = cards[0];
    $: currentIndex = cards.indexOf(currentCard);

    const CLICK_COOLDOWN = 5;
    let secondsSinceLastClick = CLICK_COOLDOWN;


    function cardClicked(e: Movie): void
    {
        currentCard = e;
        secondsSinceLastClick = 0;
    }

    function detailsClicked(e: Movie): void
    {
        goto(`/movie/${e.id}`);
    }

    setInterval(() => {
        secondsSinceLastClick++;
    }, 1000);

    setInterval(() => {
        if (secondsSinceLastClick > CLICK_COOLDOWN) {
            let nextIndex = currentIndex + 1;
            if (nextIndex == cards.length) {
                nextIndex = 0;
            }
            currentCard = cards[nextIndex];
        }
    }, 10000);
</script>

<div class="main-content">
    <div class="hero-section">
        <picture>
            {#each [cards[currentIndex]] as src (currentIndex)}
                <img transition:fade src="/api/movie/{currentCard.id}/banner" alt={currentCard.name} class="banner-img">
            {/each}
        </picture>
        <div class="hero-left">
            <h1>{currentCard.name}</h1>
            <p class="banner-subtitle">{currentCard.description}</p>
            <a href="/movie/{currentCard.id}" sveltekit:prefetch>
                <Button class="details-button">See details</Button>
            </a>
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
                image="/api/movie/{card.id}/banner"/>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>