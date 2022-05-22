<script lang="ts">
    import { AccountPicture } from "$lib";
    import { TextBlock } from "fluent-svelte";
    import { ReviewApiContext } from "../../api/ReviewApiContext";

    export let review: ReviewApiContext;
</script>

<AccountPicture size={32} userId={review.userId}/>
<TextBlock>{review.username}</TextBlock>
<TextBlock>{review.content}</TextBlock>
<TextBlock>Rating: {review.rating}/5</TextBlock>

<style lang="scss">
    @use "MovieReview";
</style>