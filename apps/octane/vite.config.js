import { defineConfig } from 'vite';
import { octane } from '@octanejs/vite-plugin';

export default defineConfig({
  plugins: [octane()],
  // Reason: Vite's cold-start scanner does not run Octane's TSX compiler and
  // would otherwise interpret the source as React JSX before the plugin runs.
  optimizeDeps: {
    noDiscovery: true
  },
  build: {
    target: 'esnext'
  },
  base: './',
  server: {
    port: 3000
  }
});
