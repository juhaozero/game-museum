/// <reference types="vite/client" />

/** 规范化子路径：空或 `/` → 无前缀；否则保证以 `/` 开头、无尾斜杠 */
export function normalizeBasePath(raw?: string | null): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed || trimmed === '/') return ''
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeading.replace(/\/+$/, '')
}

function readRouteSuffix(env: Record<string, string | undefined>): string | undefined {
  return (
    env.PUBLIC_ROUTE_SUFFIX ??
    env.NEXT_PUBLIC_ROUTE_SUFFIX ??
    env.PUBLIC_BASE_PATH ??
    env.NEXT_PUBLIC_BASE_PATH ??
    env.BASE_URL
  )
}

function readViteBaseUrl(): string | undefined {
  try {
    // Vite 只内联静态成员访问 `import.meta.env.BASE_URL`
    return import.meta.env.BASE_URL
  } catch {
    return undefined
  }
}

const ENV_KEYS = [
  'PUBLIC_ROUTE_SUFFIX',
  'PUBLIC_BASE_PATH',
  'NEXT_PUBLIC_ROUTE_SUFFIX',
  'NEXT_PUBLIC_BASE_PATH',
  'BASE_URL',
] as const

function defaultEnv(): Record<string, string | undefined> {
  const fromImportMeta: Record<string, string | undefined> = {}
  try {
    const metaEnv = import.meta.env as ImportMetaEnv & Record<string, string | undefined>
    for (const key of ENV_KEYS) {
      const value = metaEnv[key]
      if (value !== undefined) fromImportMeta[key] = value
    }
  } catch {
    /* ignore */
  }
  return fromImportMeta
}

/**
 * 当前站点 basePath（如 `/museum`；根路径时为 `""`）。
 * - 传入 env（vite.config）：读 PUBLIC_ROUTE_SUFFIX
 * - 运行时无参：优先 Vite `import.meta.env.BASE_URL`
 */
export function getBasePathFromEnv(
  env?: Record<string, string | undefined>,
): string {
  if (env) {
    return normalizeBasePath(readRouteSuffix(env))
  }
  return (
    normalizeBasePath(readViteBaseUrl()) ||
    normalizeBasePath(readRouteSuffix(defaultEnv()))
  )
}

/** 给站内路径加上 base，如 `/manifest.json` → `/museum/manifest.json` */
export function withBasePath(path: string): string {
  const base = getBasePathFromEnv()
  if (!path || path === '/') return base || '/'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (base && (normalized === base || normalized.startsWith(`${base}/`))) {
    return normalized
  }
  return `${base}${normalized}`
}
