<script lang="ts">
    import type { NavigationItem } from "$data/navigation";
    import { ListItem } from "fluent-svelte";
    import { goto } from "$app/navigation";

    export let items: NavigationItem[] = [];
    export let selectedItem: NavigationItem;

    function setSelectedItem(e: NavigationItem): void
    {
        selectedItem = e;
        goto(e.href);
    }
</script>

<div class="list">
    {#each items as item}
    <ListItem selected={item == selectedItem} on:click={() => setSelectedItem(item)}>{item.name}</ListItem>
    {/each}
</div>

<style lang="scss">
    @use "NavigationList";
</style>