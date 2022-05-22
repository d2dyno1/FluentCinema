<script lang="ts">
    import {MovieReview} from "$lib";
    import { Button, TextBlock } from "fluent-svelte";
    import {ReviewApiContext} from "../../../api/ReviewApiContext";
    import { fade } from "svelte/transition";

    export let reviews: ReviewApiContext[];
    export let currentReview: number = 0;

    function nextReview() {
        if (currentReview + 1 >= reviews.length) {
            currentReview = 0;
        } else {
            currentReview++;
        }
    }

    function previousReview() {
        if (currentReview - 1 < 0) {
            currentReview = reviews.length - 1;
        } else {
            currentReview--;
        }
    }
</script>

{#if reviews.length > 0}
    <div class="title">
        <TextBlock variant="title">Reviews</TextBlock>
    </div>
    <div class="reviews-section">
        <div class="button">
            <Button on:click={previousReview}>&lt;</Button>
        </div>
        <div class="content-wrapper">
            {#each [reviews[currentReview]] as review (currentReview)}
                <div class="content" transition:fade="{{duration: 200}}">
                    <MovieReview review={review}/>
                </div>
            {/each}
        </div>
        <div class="button">
            <Button on:click={nextReview}>&gt;</Button>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "ReviewsSection";
</style>