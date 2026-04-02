/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const RASTRO_PROXY_PATH = '/api/rastro'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rastrosystemTarget =
    env.VITE_RASTRO_PROXY_TARGET?.trim() || 'https://teste.rastrosystem.com.br'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/health': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        [RASTRO_PROXY_PATH]: {
          target: rastrosystemTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/rastro/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: false,
      clearMocks: true,
    },
  }
})
