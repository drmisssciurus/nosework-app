import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// удалить прокси
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:5279',
    },
  },
});
