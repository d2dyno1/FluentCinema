<script lang="ts">
    import { Button, ProgressRing } from "fluent-svelte";
    import { createEventDispatcher } from "svelte";

    export let variant = "accent";
    export let promise: Promise<any>;

    const dispatch = createEventDispatcher();
    const click = () => dispatch('click');
</script>

<div>
    {#await promise}
        <ProgressRing size={28}/>
    {:then value}
        <Button {variant} on:click={click}><slot/></Button>
    {:catch err}
        <Button {variant} on:click={click}><slot/></Button>
    {/await}
</div>