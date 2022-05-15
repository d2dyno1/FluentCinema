<script lang="ts">
    import type {Review} from "$db/movie/Review";
    import AccountPicture from "../AccountPicture/AccountPicture.svelte";
    import {TextBlock} from "fluent-svelte";

    export let review: Review;
</script>

<AccountPicture size={32} userId={review.userId}/>
<TextBlock>{review.username}</TextBlock>
<TextBlock>{review.content}</TextBlock>
<TextBlock>Rating: {review.rating}/5</TextBlock>

<style lang="scss">
    @use "MovieReview";
</style>