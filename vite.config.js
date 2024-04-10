import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  // eslint-disable-next-line no-undef
  base: process.env.BASE,
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    eslint({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),]
});