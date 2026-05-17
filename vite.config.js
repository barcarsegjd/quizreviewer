import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/quizreviewer/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
