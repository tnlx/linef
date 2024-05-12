import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  // eslint-disable-next-line no-undef
  base: process.env.BASE,
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        index: './index.html',
        sw: './src/sw.js',
      },
      output: {
        entryFileNames: assetInfo => assetInfo.name === 'sw' ? '[name].js' : 'assets/[name].js',
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  plugins: [
    react(),
    eslint({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),]
});