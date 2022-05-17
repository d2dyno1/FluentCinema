<script lang="ts">
    import {MovieReview} from "$lib";
    import {TextBlock} from "fluent-svelte";
    import {ReviewResponse} from "$data/response/ReviewResponse";

    export let reviews: ReviewResponse[];
</script>

<div>
    <TextBlock>Reviews</TextBlock>
    {#each reviews as review}
    <MovieReview review={review}/>
    {/each}
</div>

<style lang="scss">
    @use "ReviewsSection";
</style>