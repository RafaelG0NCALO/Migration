// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/check-urls': {
        target: 'https://apipythonmigration.vercel.app', // URL do seu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/check-urls/, '/check-urls'),
      },
    },
  },
});
