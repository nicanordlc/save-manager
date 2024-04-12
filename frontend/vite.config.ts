/// <reference types="vitest" />

import {defineConfig} from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import oxlintPlugin from 'vite-plugin-oxlint'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  plugins: [react(), oxlintPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
