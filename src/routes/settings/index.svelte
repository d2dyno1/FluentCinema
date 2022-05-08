<script lang="ts">
    import { ActionBlock } from "$lib";
    import { Button } from "fluent-svelte";


    let files: HTMLInputElement;
    function uploadPicture() {
        fetch("/api/account/picture/upload", {
            method: "PUT",
            body: files.files[0]
        }).then(() => window.location.reload());
    }
</script>

<div>
    <input bind:this={files} type="file" accept=".jpg, .jpeg, .png, .svg">
    <Button on:click={uploadPicture}>upload</Button>
</div>

<ActionBlock title="Password" description="a">
    <Button slot="action">Change</Button>
</ActionBlock>

<ActionBlock isClickableEffect={true} title="Example category" description="Example description">
    <svg slot="icon" style="filter: invert(100%)" width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 7c.28 0 .5.22.5.5v3a.5.5 0 01-1 0v-3c0-.28.22-.5.5-.5z"></path><path d="M8 6.25a.75.75 0 100-1.5.75.75 0 000 1.5z"></path><path d="M2 8a6 6 0 1112 0A6 6 0 012 8zm6-5a5 5 0 100 10A5 5 0 008 3z"></path></svg>
</ActionBlock>

<style lang="scss">
    @use "settings";
</style>