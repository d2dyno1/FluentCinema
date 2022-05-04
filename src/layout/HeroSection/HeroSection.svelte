<script lang="ts">
    import { Button } from "fluent-svelte";
    import { PageSection } from "$lib";
</script>

<div class="hero-section">
    <picture>
        <img alt="hero image" src="https://www.withanaccent.com/wp-content/uploads/2019/01/john-wick-3-banner.jpg">
    </picture>
    <div class="hero-left">
        <h1>John Wick</h1>
        <p>Chapter 3 Parabellum</p>
        <Button>See details</Button>
    </div>
</div>

<style lang="scss">
    @use "HeroSection";
</style>