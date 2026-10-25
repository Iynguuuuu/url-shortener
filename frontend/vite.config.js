import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: React plugin + a test setup for Vitest.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
