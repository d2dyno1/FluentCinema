<script lang="ts">
    import type { Review } from "$api/Review";
    import { AccountPicture } from "$lib";
    import { TextBlock } from "fluent-svelte";
    import Rating from "$lib/Rating/Rating.svelte";

    export let review: Review;
</script>

<div class="movie-review">
    <div class="reviewer">
        <AccountPicture size={64} userId={review.userId}/>
        <TextBlock>{review.username}</TextBlock>
    </div>
    <div class="content">
        <Rating rating={review.rating} text="{review.rating}/5"></Rating>
        <div>{review.content}</div>
    </div>
</div>

<style lang="scss">
    @use "MovieReview";
</style>