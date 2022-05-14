<script lang="ts">
    import {PersonPicture} from "fluent-svelte";

    import ProfileIcon from "@fluentui/svg-icons/icons/person_32_filled.svg?raw";
    import {onMount} from "svelte";

    export let userId: string;
    export let size: number;

    let base64;
    let isDefault;
    let promise;

    onMount(() => {
        fetch(`/api/account/${userId}/picture`).then(response => {
            if (response.headers.get("content-type").startsWith("image/")) {
                promise = fetch(`/api/account/${userId}/picture`).then(response => response.arrayBuffer()).then(buffer => {
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        base64 = event.target.result.split(",")[1];
                        isDefault = false;
                    }
                    reader.readAsDataURL(new Blob([buffer]));
                });
            } else {
                isDefault = true;
            }
        });
    });
</script>

<PersonPicture size={size}>
    {#await promise then value}
        {#if isDefault}
            {@html ProfileIcon}
        {:else}
            <img style="height: {size}px; width: {size}px;" class="user-picture" alt=" " src={`data:image/png;base64,${base64}`}>
        {/if}
    {/await}
</PersonPicture>

<style lang="scss">
    @use "AccountPicture";
</style>