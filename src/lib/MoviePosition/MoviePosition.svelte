<script lang="ts">
    export let name: string;
    export let episode: string;
    export let description: string;
    export let rating: number;
    export let image: any;
</script>

<div class="item" on:click>
    <div class="item-inner">
        <picture>
            <img class="item-poster" alt={name} src={image}>
        </picture>
        <div class="details">
            <div>
                <h4 class="title">{name}</h4>
                <div class="subtitle">{episode}</div>
                <div class="description-text">{description}</div>
            </div>
            <div class="rating">Rating: {rating}/5</div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "MoviePosition";
</style>