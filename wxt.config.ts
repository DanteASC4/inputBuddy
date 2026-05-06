import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/auto-icons"],
  manifest: {
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
