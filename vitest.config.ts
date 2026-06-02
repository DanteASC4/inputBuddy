import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@c": fileURLToPath(new URL("./src/lib/components", import.meta.url)),
      "@u": fileURLToPath(new URL("./src/lib/utils", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/lib/types.ts", import.meta.url)),
      $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
  },
});
