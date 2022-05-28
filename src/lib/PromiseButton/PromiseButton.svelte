<script lang="ts">
    import { Button, ProgressRing } from "fluent-svelte";
    import { createEventDispatcher } from "svelte";

    export let variant: "standard" | "accent" | "hyperlink" = "standard";
    export let promise: Promise<any>;
    export let keepDisabledAfterResolve: boolean = false;

    let isPromisePending: boolean = false;
    let isPromiseRejected: boolean = false;

    $: inProgress = !isPromiseRejected && (isPromisePending || (promise != null && keepDisabledAfterResolve));

    $: if (promise != null) {
        isPromisePending = true;
        isPromiseRejected = false;

        promise.then(() => {
            isPromisePending = false;
        });
        promise.catch(() => {
            isPromisePending = false;
            isPromiseRejected = true;
        })
    }

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
</script>

<Button disabled={inProgress} {variant} on:click={click}>
    <slot/>
    {#if inProgress}
        &nbsp;&nbsp;<ProgressRing/>
    {/if}
</Button>