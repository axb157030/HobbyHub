import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { configDotenv } from 'dotenv'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    configDotenv({
      path: ".env.example"
    })
  ],
})
