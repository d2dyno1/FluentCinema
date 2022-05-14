<script lang="ts">
    import { Button } from "fluent-svelte";
    
    import TimerIcon from "@fluentui/svg-icons/icons/timer_32_filled.svg?raw";
    import CalendarIcon from "@fluentui/svg-icons/icons/calendar_star_24_filled.svg?raw";

</script>

<div class="movie-content">
    <picture>
        <img class="movie-poster" alt="img" src="/images/JohnWick3/John-Wick-3-poster.jpg">
    </picture>
    <div class="description">
        <div class="title">
            John Wick 3 Parabellum
            <div>
                <Button variant="accent">Watch now</Button>
            </div>
        </div>
        <div class="length-and-premiere">
            <div>
                {@html TimerIcon} 132min
            </div>
            <div>
                {@html CalendarIcon} May 9th 2019
            </div>
        </div>
        <div class="movie-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, molestias id? Ab, ipsam ex. Officia voluptate debitis corporis consectetur harum asperiores rem vitae perferendis dolores enim molestiae esse amet nobis est modi, magni aperiam qui eveniet iusto error laboriosam quidem delectus adipisci! Voluptate, ipsa animi ea vel sunt molestiae distinctio!
        </div>
    </div>
</div>

<style lang="scss">
    @use "MovieHeroSection";
</style>