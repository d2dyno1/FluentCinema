<script lang="ts">
    import {MovieReview} from "$lib";
    import {TextBlock} from "fluent-svelte";
    import {ReviewApiContext} from "../../../api/ReviewApiContext";

    export let reviews: ReviewApiContext[];
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