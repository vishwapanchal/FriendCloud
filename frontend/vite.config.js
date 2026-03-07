import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/sysinfo': 'http://localhost:8000',
      '/launch': 'http://localhost:8000',
      '/execute': 'http://localhost:8000',
      '/terminate': 'http://localhost:8000',
      '/download-agent': 'http://localhost:8000'
    }
  }
})
