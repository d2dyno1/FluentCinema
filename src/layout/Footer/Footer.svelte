<script lang="ts">
    import { Button } from "fluent-svelte";
</script>

<div class="footer-wrapper">
    <div class="title-column">
        <div class="title">
            FluentCinema
        </div>
        <div class="column-title copyright">
            Copyright © 2022
        </div>
    </div>
    <div class="site-details">
        <div class="column">
            <div class="column-title">
                Links
            </div>
            <div class="column-item">
                <Button variant="hyperlink" href="/">Home</Button>
            </div>
        </div>
        <div class="column">
            <div class="column-title">
                Team
            </div>
            <div class="column-item">
                <Button variant="hyperlink" href="https://github.com/taj-ny" target="_blank">Taj_ny</Button>
            </div>
            <div class="column-item">
                <Button variant="hyperlink" href="https://github.com/d2dyno1" target="_blank">d2dyno</Button>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "Footer";
</style>