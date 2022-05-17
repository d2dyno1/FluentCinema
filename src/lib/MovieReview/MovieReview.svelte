<script lang="ts">
    import AccountPicture from "../AccountPicture/AccountPicture.svelte";
    import {TextBlock} from "fluent-svelte";
    import {ReviewResponse} from "$data/response/ReviewResponse";

    export let review: ReviewResponse;
</script>

<AccountPicture size={32} userId={review.userId}/>
<TextBlock>{review.username}</TextBlock>
<TextBlock>{review.content}</TextBlock>
<TextBlock>Rating: {review.rating}/5</TextBlock>

<style lang="scss">
    @use "MovieReview";
</style>