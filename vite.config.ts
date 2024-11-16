import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { analyzer } from "vite-bundle-analyzer";

function getModeFromArgs() {
  const args = process.argv;
  let mode = 'development'; // 默认模式为 dev

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode') {
      mode = args[i+1];
      break;
    }
  }
  return mode;
}

// https://vite.dev/config/ 
/* @ts-ignore */
export default defineConfig(({ command }) => {
  const mode = getModeFromArgs(); // 获取 mode
  const isProduction = mode === 'production';

  let plugins = [
    vue(),
  ];

  if (mode === 'development') {
    plugins.push(analyzer());
  }
  return {
    plugins,
    build: {
      sourcemap: !isProduction, // 启用 source map
    },
  };
})