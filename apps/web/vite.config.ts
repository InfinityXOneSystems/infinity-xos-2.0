import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    define: {
      'import.meta.env.VITE_FRONTEND_SHA': JSON.stringify(env.VITE_FRONTEND_SHA || 'dev'),
      'import.meta.env.VITE_CONTRACT_HASH': JSON.stringify(env.VITE_CONTRACT_HASH || 'unknown')
    }
  }
})
