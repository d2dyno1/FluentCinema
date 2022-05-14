<script lang="ts">
    import { TextBox, Button, ProgressRing } from "fluent-svelte";
    import { DialogForm } from "$layout";

    let email: string;
    let formComponent: any;
    let promise: Promise<Response>;

    function onLogin() {
        // TODO
    }
</script>

<DialogForm title="Reset password" bind:this={formComponent}>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <div slot="footer-right">
        {#if promise == null}
            <Button variant="accent" on:click={onLogin}>Reset password</Button>
        {:else}
            {#await promise}
                <ProgressRing/>
            {/await}
        {/if}
    </div>
</DialogForm>

<style lang="scss">
    @use "../styles/global";
</style>