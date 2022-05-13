<script lang="ts" context="module">
    import { AccountCard } from "$lib";
    import { ok } from "$lib/responses";
    import type { Session } from "$data/Session";

    let session_: Session; // "session" doesn't work for some reason...

    export async function load({ session }) {
        session_ = session;
        return ok;
    }
</script>

<div class="wrapper">
    <AccountCard session={session_}/>
    <slot/>
</div>

<style lang="scss">
    @use "src/styles/mixins" as *;

    .wrapper {
        @include flex($direction: row);
        flex: 1 1 auto;
        padding: 2%;
    }

</style>