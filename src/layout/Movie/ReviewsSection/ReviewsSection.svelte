<script lang="ts">
    import { MovieReview } from "$lib";
    import { Button, TextBlock } from "fluent-svelte";
    import { ReviewApiContext } from "../../../api/ReviewApiContext";
    import { fade } from "svelte/transition";

    import RightArrow from "@fluentui/svg-icons/icons/caret_right_24_filled.svg?raw";
    import LeftArrow from "@fluentui/svg-icons/icons/caret_left_24_filled.svg?raw";

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
        <div class="button-wrapper">
            <div class="flipview-button" on:click={previousReview}>{@html LeftArrow}</div>
        </div>
        <div class="content-wrapper">
            {#each [reviews[currentReview]] as review (currentReview)}
                <div class="content" transition:fade="{{duration: 200}}">
                    <MovieReview review={review}/>
                </div>
            {/each}
        </div>
        <div class="button-wrapper">
            <div class="flipview-button" on:click={nextReview}>{@html RightArrow}</div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "ReviewsSection";
</style>