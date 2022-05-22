<script lang="ts" context="module">
    import { Navbar } from "$layout";
    import type { NavbarButton, NavbarItem } from "$data/navbar";
    import { ok } from "$api/responses";
    import { accountSession } from "$/stores";
    import type { Load } from "@sveltejs/kit";

    import CodeIcon from "@fluentui/svg-icons/icons/code_24_filled.svg?raw";
    import HomeIcon from "@fluentui/svg-icons/icons/home_24_filled.svg?raw";
    import MoviesIcon from "@fluentui/svg-icons/icons/movies_and_tv_24_filled.svg?raw";

    const navbarItems: NavbarItem[] = [
        {
            name: "Home",
            path: "/",
            icon: HomeIcon
        },
        {
            name: "Movies",
            path: "/all-movies",
            icon: MoviesIcon
        }
    ];
    const navbarButtons: NavbarButton[] = [
        {
            name: "View GitHub repository",
            path: "https://github.com/d2dyno1/FluentCinema",
            icon: CodeIcon
        }
    ];

    export const load: Load = async ({ session }) => {
        accountSession.set(session);
        return ok;
    }
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