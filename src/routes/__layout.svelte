<script lang="ts" context="module">
    import { Navbar } from "$layout";
    import type { NavbarButton, NavbarItem } from "src/data/navbar";
    import { ok } from "$lib/responses";

    import Code from "@fluentui/svg-icons/icons/code_24_regular.svg?raw";
    import {promise} from "./index.svelte";

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
    ];

    export async function load({ session }) {
        if (Object.keys(session).length != 0) {
            // user is logged in
            console.log(session);
        };
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