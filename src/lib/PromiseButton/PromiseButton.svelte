<script lang="ts">
    import { Button, ProgressRing } from "fluent-svelte";
    import { createEventDispatcher } from "svelte";

    export let promise: Promise<any> = null;
    export let onClick: () => Promise<any> = null;
    export let variant: "standard" | "accent" | "hyperlink" = "standard";
    export let keepDisabledAfterResolve: boolean = false;
    export let disabled: boolean = false;

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
    const click = () => {
        if (onClick != null) {
            promise = onClick();
        }
        dispatch("click");
    }
</script>

<Button disabled={disabled || inProgress} {variant} on:click={click}>
    <slot/>
    {#if inProgress}
        &nbsp;&nbsp;<ProgressRing/>
    {/if}
</Button>