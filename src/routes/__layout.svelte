<script lang="ts">
    import { Navbar } from "$layout";
    import "fluent-svelte/theme.css";
</script>

<Navbar/>
<slot/>
<!-- <Footer/> -->

<style global lang="scss">
  @use "src/styles/global";

  /* Needed for adaptive theme */
  :global(body) {
    background-color: var(--fds-solid-background-base);
    color: var(--fds-text-primary);
  }
</style>