import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/quick-links/',
  build: {
    outDir: '../quick-links',
    emptyOutDir: false
  },
  server: {
    port: 5173
  }
});
