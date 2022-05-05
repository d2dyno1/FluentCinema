<script lang="ts">
    import { Button } from "fluent-svelte";
    import type { MovieCard } from "$data/cards";

    export let cards: MovieCard[] = [];
</script>

<div>
    <div class="hero-section">
        <picture>
            <img class="banner-img" alt="hero image" src="https://www.withanaccent.com/wp-content/uploads/2019/01/john-wick-3-banner.jpg">
        </picture>
        <div class="hero-left">
            <h1>John Wick</h1>
            <p class="banner-subtitle">Chapter 3 Parabellum</p>
            <Button class="details-button">See details</Button>
        </div>
    </div>
    <div class="cards">
        {#each cards as { name, description, image }}
            <button class="card">
                <img class="small-banner-img" alt={name} src={image}>
                <h4 class="card-name">
                    {name}
                </h4>
            </button>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>