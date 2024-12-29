import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@react-three/drei': path.resolve(__dirname, 'node_modules/@react-three/drei'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
