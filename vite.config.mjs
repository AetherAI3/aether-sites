import { defineConfig } from 'vite';

// Local preview for the static collection; production retains scripts/build.mjs.
export default defineConfig({
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
});
