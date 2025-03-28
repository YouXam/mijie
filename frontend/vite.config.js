import { defineConfig } from 'vite';
import { fileURLToPath, URL } from "url";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
});
