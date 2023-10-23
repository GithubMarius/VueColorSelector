import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler',
      'icons': './node_modules/bootstrap-icons/icons'
    }
  },
  base: '/VueColorSelectorPages/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/scss/_styles.scss";
        `
      }
    }
  }
})
