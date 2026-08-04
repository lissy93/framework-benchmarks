import { defineConfig } from 'vite';
import { geaPlugin } from '@geajs/vite-plugin';

export default defineConfig({
  plugins: [geaPlugin()],
  base: './',
  server: {
    port: 3000,
    open: false
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});
