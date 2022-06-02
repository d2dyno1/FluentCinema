<script lang="ts">
    import { NumberBox } from "fluent-svelte";
    
    import TicketIcon from "@fluentui/svg-icons/icons/ticket_diagonal_24_filled.svg?raw";

    export let maxTickets: number;
    export let tickets: number;
    export let title: string;
    export let subtitle: string;
</script>

<div class="ticket-frame">
    <div>
        <div class="ticket-title">
            {@html TicketIcon}
            {title}
        </div>
        <div class="ticket-subtitle">
            {subtitle}
        </div>
    </div>
    <div class="ticket-numberbox">
        <NumberBox inline={true} min={0} bind:max={maxTickets} bind:value={tickets} clearButton={false}/>
    </div>
</div>

<style lang="scss">
    @use "TicketCard";
</style>