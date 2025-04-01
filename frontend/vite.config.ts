import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      "/api": {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      "/admin": {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
      ,"/static":{
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
