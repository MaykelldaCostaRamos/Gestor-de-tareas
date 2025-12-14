import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss({
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
        
      ],
  })],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
    historyApiFallback: true
  },
})
