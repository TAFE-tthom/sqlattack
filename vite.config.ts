import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  // Nasty but it works...
  assetsInclude: [
    "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3-opfs-async-proxy.js",
    "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.js",
    'node_modules/coi-serviceworker/coi-serviceworker.js'
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames:'assets/[name][extname]',
      }
    }
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm/*',
      'coi-serviceworker/*'],
  },
  plugins: [wasm(), topLevelAwait(), preact(), mdPlugin({ mode: [Mode.HTML,
    Mode.MARKDOWN, Mode.TOC] })],
  base: "/sqlattack/"
})
