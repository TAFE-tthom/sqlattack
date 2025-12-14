import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown';

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
  plugins: [preact(), mdPlugin({ mode: [Mode.HTML,
    Mode.MARKDOWN, Mode.TOC] })],
  base: "/sqlattack/"
})
