import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { getBasePathFromEnv } from './src/utils/routeSuffix.ts'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/** 合并 development / production 的 .env，避免 NODE_ENV 误判漏读 PUBLIC_* */
const env = {
  ...loadEnv('production', rootDir, ''),
  ...loadEnv('development', rootDir, ''),
}

const basePath = getBasePathFromEnv(env)
const base = basePath || '/'

if (process.env.NODE_ENV !== 'test') {
  console.info(`[vite] base = ${base === '/' ? '(root)' : base}`)
}

export default defineConfig({
  base,
  envPrefix: ['PUBLIC_', 'NEXT_PUBLIC_'],
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
