<script lang="ts">
    import { InfoBar } from "fluent-svelte";

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
        <InfoBar bind:open={showInfoBar} bind:message={infoBarMessage} bind:severity={infoBarSeverity} closable={false} class="full-width"/>
        <slot/>
    </div>
    <div class="footer">
        <div class="align-left">
            <slot name="footer-left"/>
        </div>
        <div class="align-right">
            <slot name="footer-right"/>
        </div>
    </div>
</div>

<style lang="scss">
    @use "DialogForm";
</style>
