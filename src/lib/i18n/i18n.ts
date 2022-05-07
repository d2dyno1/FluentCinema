import { addMessages, init } from "svelte-i18n";
export { _ as _ } from "svelte-i18n";

import en_US from "./locales/en_US.json";
import pl_PL from "./locales/pl_PL.json";

// @ts-ignore
addMessages("en_US", en_US);
// @ts-ignore
addMessages("pl_PL", pl_PL);

init({
    fallbackLocale: "en_US",
    initialLocale: "en_US"
});