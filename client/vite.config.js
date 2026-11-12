import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In development, calls to /api are forwarded to the Express server.
  server: { proxy: { '/api': 'http://localhost:5000' } },
})
