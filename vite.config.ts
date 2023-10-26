import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
  },
  plugins: [
    vue(),
    pluginRewriteAll(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
