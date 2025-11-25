import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // --- ADD THIS LINE TO FIX STATIC SITE PATHS ---
  base: ' ', 
  // --- END ADD ---
})
