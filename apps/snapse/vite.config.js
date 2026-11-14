import { defineConfig } from 'vite';

// Snapse is resolved as a normal dependency (file:../../../snapse) via its package `exports`, so no
// aliases are needed. Port 3000 and base './' match the other apps in this benchmark project.
export default defineConfig({
  base: './',
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  }
});
