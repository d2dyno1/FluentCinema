<script lang="ts">
    import { Button, ProgressRing } from "fluent-svelte";
    import { createEventDispatcher } from "svelte";

    export let variant: string;
    export let promise: Promise<any>;

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
</script>

<div>
    {#if promise == null}
        <Button variant={variant} on:click={click}><slot/></Button>
    {:else}
        {#await promise}
            <ProgressRing size={28}/>
        {/await}
    {/if}
</div>