import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildId = process.env.VITE_APP_BUILD || `local-${Date.now()}`

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_BUILD__: JSON.stringify(buildId),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
