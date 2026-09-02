import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-only: admin.flywaysglobal.com doesn't send CORS headers for
    // localhost, so proxy same-origin instead of calling it directly.
    proxy: {
      '/api': { target: 'https://admin.flywaysglobal.com', changeOrigin: true },
      '/sites': { target: 'https://admin.flywaysglobal.com', changeOrigin: true },
    },
  },
})
