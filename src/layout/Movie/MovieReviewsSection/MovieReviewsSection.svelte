<script lang="ts">
    import type { Review } from "$api/Review";
    import { MovieReview } from "$lib";
    import { TextBlock } from "fluent-svelte";
    import { fade } from "svelte/transition";

    import RightArrow from "@fluentui/svg-icons/icons/caret_right_24_filled.svg?raw";
    import LeftArrow from "@fluentui/svg-icons/icons/caret_left_24_filled.svg?raw";

    export let reviews: Review[];
    export let currentReview = 0;

    let isRightVisible = true;
    let isLeftVisible = true;

    updateButtons();

    function nextReview() {
        if (currentReview + 1 >= reviews.length) {
            currentReview = 0;
        } else {
            currentReview++;
        }

        updateButtons();
    }

    function previousReview() {
        if (currentReview - 1 < 0) {
            currentReview = reviews.length - 1;
        } else {
            currentReview--;
        }

        updateButtons();
    }

    function updateButtons() {
        // isRightVisible = (currentReview + 1) < reviews.length;
        // isLeftVisible = (currentReview - 1) > 0;
    }
</script>

{#if reviews.length > 0}
<div class="wrapper">
    <div class="title">
        <TextBlock variant="title">Reviews</TextBlock>
    </div>
    <div class="reviews-section">
        <div class="button-wrapper">
            {#if isLeftVisible}
                <div transition:fade={{duration: 125}} class="flipview-button" on:click={previousReview}>{@html LeftArrow}</div>
            {:else}
                <div class="flipview-button-placeholder"/>
            {/if}
        </div>
        <div class="content-wrapper">
            {#each [reviews[currentReview]] as review (currentReview)}
                <div class="content" transition:fade="{{duration: 200}}">
                    <MovieReview review={review}/>
                </div>
            {/each}
        </div>
        <div class="button-wrapper">
            {#if isRightVisible}
                <div transition:fade={{duration: 125}} class="flipview-button" on:click={nextReview}>{@html RightArrow}</div>
            {:else}
                <div class="flipview-button-placeholder"/>
            {/if}
        </div>
    </div>
</div>
{/if}

<style lang="scss">
    @use "MovieReviewsSection";
</style>