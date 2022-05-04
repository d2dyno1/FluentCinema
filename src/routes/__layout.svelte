<script lang="ts">
    import { Navbar } from "$layout";

    import "fluent-svelte/theme.css";
</script>

<Navbar/>
<slot/>
<!-- <Footer/> -->

<style>
  :global(body) {
    background-color: var(--fds-solid-background-base);
    color: var(--fds-text-primary);
  }
</style>