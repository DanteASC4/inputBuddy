import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Input Buddy",
    author: { email: "zexovon@gmail.com" },
    license: "GPL-3.0-or-later",
    description: `InputBuddy aims to remove repetitive typing from web forms.

Save common label + answer pairs, like First Name -> Bob or Email -> you@example.com. When page has matching text input, InputBuddy finds best saved answer and fills field automatically.

Features:
- Open source, free, simple
- Save reusable answers
- Smart matchers to catch more text inputs
  - fuzzy, partial, similar, exact
- Group answers into profiles
- Auto-fill matching text inputs
  - Alternative Manual fill current page mode
- Show floating menu for likely matches
- Toggle extension anytime

InputBuddy built for forms browser autofill misses, especially custom forms, odd labels, and repeated application fields.`,
    permissions: ["storage", "tabs"],
    host_permissions: ["<all_urls>"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@c": fileURLToPath(new URL("./src/lib/components", import.meta.url)),
        "@u": fileURLToPath(new URL("./src/lib/utils", import.meta.url)),
        "@types": fileURLToPath(new URL("./src/lib/types.ts", import.meta.url)),
        $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
    },
  }),
});
