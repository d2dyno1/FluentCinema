<script lang="ts">
    import { AccountPicture } from "$lib";
    import { TextBlock } from "fluent-svelte";
    import { ReviewApiContext } from "../../api/ReviewApiContext";
    import Rating from "$lib/Rating/Rating.svelte";

    export let review: ReviewApiContext;
</script>

<div class="movie-review">
    <div class="reviewer">
        <AccountPicture size={64} userId={review.userId}/>
        <TextBlock>{review.username}</TextBlock>
    </div>
    <div class="content">
        <Rating rating={review.rating} text="{review.rating}/5.0"></Rating>
        <TextBlock>{review.content}</TextBlock>
    </div>
</div>

<style lang="scss">
    @use "MovieReview";
</style>