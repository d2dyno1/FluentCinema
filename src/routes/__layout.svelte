<script lang="ts" context="module">
    import { Navbar } from "$layout";
    import type { NavbarButton, NavbarItem } from "$data/navbar";
    import type { User } from "$data/User";
    import { ok } from "$lib/responses";

    import Code from "@fluentui/svg-icons/icons/code_24_regular.svg?raw";
    import type {Session} from "../data/Session";

    let session_: Session; // "session" doesn't work for some reason...

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
        session_ = session;
        return ok;
    }
</script>

<Navbar session={session_} navbarItems={navbarItems} navbarButtons={navbarButtons}/>
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