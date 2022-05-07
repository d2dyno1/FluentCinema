<script lang="ts">
    import { Navbar } from "$layout";
    import type { NavbarButton, NavbarItem } from "src/data/navbar";

    import Code from "@fluentui/svg-icons/icons/code_24_regular.svg?raw";

    const navbarItems: NavbarItem[] = [
        {
            name: "Home",
            path: "/",
            icon: null // TODO: Home icon (fluentui icons)
        }
    ];
    const navbarButtons: NavbarButton[] = [
        {
            name: "View GitHub repository",
            path: "https://github.com/d2dyno1/FluentCinema",
            icon: Code
        }
    ]
</script>

<Navbar navbarItems={navbarItems} navbarButtons={navbarButtons}/>
<slot/>
<!-- <Footer/> -->

<style global lang="scss">
    @use "src/styles/global";

    /* Needed for adaptive theme */
    :global(body) {
        background-color: var(--fds-solid-background-base);
        color: var(--fds-text-primary);
        margin: 0px;
    }
</style>