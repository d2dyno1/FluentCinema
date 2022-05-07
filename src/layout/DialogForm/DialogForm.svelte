<script lang="ts">
    import { InfoBar, TextBlock } from "fluent-svelte";

    export let title;

    let showInfoBar = false;
    let infoBarSeverity = "";
    let infoBarMessage = "";

    export function showMessage(message) {
        showInfoBar = true;
        infoBarMessage = message;
    }

    export function showSuccessMessage(message) {
        showMessage(message);
        infoBarSeverity = "success";
    }

    export function showCriticalMessage(message) {
        showMessage(message);
        infoBarSeverity = "critical";
    }

    export function hideMessage() {
        showInfoBar = false;
    }
</script>


<div class="dialog-form">
    <div class="content">
        <TextBlock variant="subtitle">{title}</TextBlock>
        <InfoBar bind:open={showInfoBar} bind:message={infoBarMessage} bind:severity={infoBarSeverity} closable={false} class="full-width"/>
        <slot/>
    </div>
    <div class="footer">
        <slot name="footer-left"/>
        <div class="footer-right">
            <slot name="footer-right"/>
        </div>
    </div>
</div>

<style lang="scss">
    @use "DialogForm";
</style>
