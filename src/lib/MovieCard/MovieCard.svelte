<script lang="ts">
    export let name: string = "";
    export let selected: boolean = false;
    export let image: any = null;
</script>

<div class="card" on:dblclick on:click class:selected>
    <img class="small-banner-img" alt={name} src={image}>
    <div class="card-name">
        <h4>
            {name}
        </h4>
    </div>
</div>

<style lang="scss">
    @use "MovieCard";
</style>