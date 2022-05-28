<script lang="ts">
    import { InfoBar, TextBox } from "fluent-svelte";

    export let validator: any;
    export let isValid = false;
    export let value: string;

    $: isOpen = focused || (value == "" && !isValid);

    let errorMessage: string;
    let focused = false;

    $: (async () => {
        try {
            await validator.validate(value);
            isValid = true;
        } catch (e) {
            errorMessage = e.message;
            isValid = false;
        }
    })();
</script>

<div class="validated-text-box">
    <TextBox {...$$restProps} bind:value={value} on:focusin={() => focused = true}/>
    <InfoBar severity="critical" message={errorMessage} closable={false} open={focused && !isValid}></InfoBar>
</div>

<style lang="scss">
    @use "ValidatedTextBox";
</style>