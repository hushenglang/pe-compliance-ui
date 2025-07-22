import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: '/pe-compliance-ui/',
    define: {
      // Ensure environment variables are available at build time
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL)
    }
  }
})
