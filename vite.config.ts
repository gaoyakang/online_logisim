import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    analyzer()
  ],
  build: {
    sourcemap: true // 启用 source map
  }
})
