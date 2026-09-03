import { getBasePathFromEnv } from '@/utils/routeSuffix'

/** 去掉尾斜杠的站点 Origin（不含 path） */
export function normalizeSiteOrigin(raw?: string | null): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  return trimmed.replace(/\/+$/, '')
}

function readSiteUrlFromEnv(
  env?: Record<string, string | undefined>,
): string | undefined {
  if (env) return env.PUBLIC_SITE_URL
  try {
    return (import.meta.env as ImportMetaEnv).PUBLIC_SITE_URL
  } catch {
    return undefined
  }
}

/**
 * 站点 Origin。
 * - 传入 env：只读该对象的 PUBLIC_SITE_URL（空则无 Origin）
 * - 运行时无参：PUBLIC_SITE_URL → window.location.origin
 */
export function getSiteOrigin(
  env?: Record<string, string | undefined>,
): string {
  if (env) {
    return normalizeSiteOrigin(env.PUBLIC_SITE_URL)
  }
  const fromEnv = normalizeSiteOrigin(readSiteUrlFromEnv())
  if (fromEnv) return fromEnv
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

/**
 * 站内路径 → 绝对 URL（含 PUBLIC_ROUTE_SUFFIX / base）。
 * pathname 为 Router 路径（不含 basename），如 `/`、`/game/abc`。
 * 无 Origin 时返回带 base 的站内绝对路径。
 */
export function absoluteSiteUrl(
  pathname = '/',
  env?: Record<string, string | undefined>,
): string {
  const base = getBasePathFromEnv(env)
  const suffix =
    !pathname || pathname === '/'
      ? ''
      : pathname.startsWith('/')
        ? pathname
        : `/${pathname}`
  const fullPath = `${base}${suffix}` || '/'
  const origin = getSiteOrigin(env)
  if (!origin) return fullPath
  return fullPath === '/' ? origin : `${origin}${fullPath}`
}

/** 首页绝对 URL（构建期注入用） */
export function homeSiteUrl(env?: Record<string, string | undefined>): string {
  return absoluteSiteUrl('/', env)
}
