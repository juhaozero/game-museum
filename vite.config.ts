import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv, type Plugin } from 'vite'
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

function resolveSiteCanonical(
  envMap: Record<string, string | undefined>,
  routeBase: string,
): string {
  const origin = (envMap.PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '')
  if (!origin) return routeBase || '/'
  return routeBase ? `${origin}${routeBase}` : origin
}

const siteCanonical = resolveSiteCanonical(env, basePath)

if (process.env.NODE_ENV !== 'test') {
  console.info(`[vite] base = ${base === '/' ? '(root)' : base}`)
  console.info(`[vite] site canonical = ${siteCanonical}`)
}

function htmlEnvPlaceholders(): Plugin {
  return {
    name: 'html-env-placeholders',
    transformIndexHtml(html) {
      const lightFlag = env.PUBLIC_ENABLE_LIGHT_MODE ?? ''
      return html
        .replaceAll('%SITE_CANONICAL%', siteCanonical)
        .replaceAll('%PUBLIC_ENABLE_LIGHT_MODE%', lightFlag)
    },
  }
}

export default defineConfig({
  base,
  build: {
    outDir: 'museum',
  },
  envPrefix: ['PUBLIC_', 'NEXT_PUBLIC_'],
  plugins: [react(), tailwindcss(), htmlEnvPlaceholders()],
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
