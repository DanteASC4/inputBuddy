import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    permissions: ['storage'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@c': fileURLToPath(new URL('./src/lib/components', import.meta.url)),
        '@u': fileURLToPath(new URL('./src/lib/utils', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/lib/types.ts', import.meta.url)),
        $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      },
    },
  }),
});
