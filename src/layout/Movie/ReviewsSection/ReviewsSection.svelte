<script lang="ts">
    import type {Review} from "/db/movie/Review";
    import {MovieReview} from "$lib";
    import {TextBlock} from "fluent-svelte";

    export let reviews: Review[];
</script>

<TextBlock>Reviews</TextBlock>
{#each reviews as review}
    <MovieReview review={review}/>
{/each}

<style lang="scss">
    @use "ReviewsSection";
</style>