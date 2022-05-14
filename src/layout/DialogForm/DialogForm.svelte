<script lang="ts">
    import { InfoBar, TextBlock } from "fluent-svelte";
    import {InfoBarSeverity} from "../../data/InfoBarSeverity";

    export let title;

    let showInfoBar = false;
    let infoBarSeverity: InfoBarSeverity;
    let infoBarMessage: string;

    export function showMessage(message, severity: InfoBarSeverity) {
        showInfoBar = true;
        infoBarMessage = message;
        infoBarSeverity = severity;
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
