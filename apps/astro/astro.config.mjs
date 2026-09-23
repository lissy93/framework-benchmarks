import { defineConfig } from 'astro/config';

// Assets are emitted with a relative prefix, so the built app can be served
// from any sub-path (e.g. /astro/app/) by the benchmark server.
export default defineConfig({
  output: 'static',
  build: {
    assetsPrefix: '.'
  },
  server: {
    port: 3000
  },
  devToolbar: {
    enabled: false
  }
});
