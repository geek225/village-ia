import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/agnes': {
        target: 'https://apihub.agnes-ai.com/v1',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/agnes/, ''),
      },
    },
  },
})




