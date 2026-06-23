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
    description: `InputBuddy aims to remove repetitive typing from forms. Save common label + answer pairs and InputBuddy will auto-fill them.`,
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
