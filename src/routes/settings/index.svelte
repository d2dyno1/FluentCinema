<script lang="ts" context="module">
    import { ActionBlock } from "$lib";
    import { Button, ComboBox } from "fluent-svelte";
    import {ok} from "../../lib/responses";
    import type {Session} from "../../data/Session";

    import LanguageIcon from "@fluentui/svg-icons/icons/local_language_24_filled.svg?raw";

    const languages = [
        {
            name: "English",
            value: "en_US"
        },
        {
            name: "Polish",
            value: "pl_PL"
        }
    ];

    let _session: Session;
    let files: HTMLInputElement;
    function uploadPicture() {
        fetch("/api/account/picture/upload", {
            method: "PUT",
            body: files.files[0]
        }).then(() => window.location.reload());
    }

    function uploadSettings() {
        fetch("/api/account/settings/update", {
            method: "PUT",
            body: JSON.stringify(_session.user.settings)
        });
    }

    export async function load({ session }) {
        _session = session;
        if (!session.isLoggedIn) {
            return {
                status: 302,
                redirect: "/"
            }
        }
        return ok;
    };
</script>

<div>
    <input bind:this={files} type="file" accept=".jpg, .jpeg, .png, .svg">
    <Button on:click={uploadPicture}>upload</Button>
</div>

<ActionBlock title="Language" description="placeholder" icon={LanguageIcon}>
    <ComboBox slot="action" items={languages} bind:value={_session.user.settings.language}></ComboBox>
</ActionBlock>
<Button on:click={uploadSettings}>Save settings</Button>

<style lang="scss">
    @use "settings";
</style>