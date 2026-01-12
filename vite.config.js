import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url))
    }
  },
  plugins: [
    svelte()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // include all scss abstracts automatically
        additionalData: `@use "${fileURLToPath(new URL('./src/styles/abstracts/mixins', import.meta.url))}" as *;`
      }
    }
  }
});
