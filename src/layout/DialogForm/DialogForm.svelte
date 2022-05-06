<script>
    import { ContentDialog, InfoBar } from "fluent-svelte";

    export let title;
    export let container;

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


<ContentDialog open={true} title={title} darken={false} trapFocus={false}>
    <div class="main">
        <InfoBar bind:open={showInfoBar} bind:message={infoBarMessage} bind:severity={infoBarSeverity} closable={false} class="full-width"/>
        <slot class="main"/>
    </div>
    <div slot="footer" class="footer">
        <div class="align-left">
            <slot name="footer-left"/>
        </div>
        <div class="align-right">
            <slot name="footer-right"/>
        </div>
    </div>
</ContentDialog>

<style lang="scss">
    @use "DialogForm";
</style>
