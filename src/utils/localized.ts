import type { Locale } from '@/i18n/messages'
import type { LocalizedText } from '@/types/manifest'

export type { LocalizedText }

/**
 * 按当前语言取展策文案。
 * - 字符串：所有语言共用（兼容旧配置）
 * - `{ zh, en }`：取对应语言；缺省则返回 undefined，由调用方回退 i18n
 */
export function pickLocalized(
  value: LocalizedText | undefined | null,
  locale: Locale,
): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }
  if (typeof value !== 'object') return undefined

  const primary = value[locale]
  if (typeof primary === 'string' && primary.trim()) return primary.trim()
  return undefined
}

/** 展示名：当前语言的 title，缺省回退规范名（文件夹 / 分类键） */
export function displayGameName(
  folderName: string,
  title: LocalizedText | undefined,
  locale: Locale,
): string {
  return pickLocalized(title, locale) || folderName
}

/** 分类展示名（与游戏名同一套规则） */
export function displayCategoryName(
  canonical: string,
  title: LocalizedText | undefined,
  locale: Locale,
): string {
  return displayGameName(canonical, title, locale)
}

function collectNameVariants(
  folderName: string,
  title?: LocalizedText,
): string[] {
  const variants = [folderName]
  if (typeof title === 'string') {
    variants.push(title)
  } else if (title && typeof title === 'object') {
    if (title.zh) variants.push(title.zh)
    if (title.en) variants.push(title.en)
  }
  return variants
}

/** 搜索：文件夹名 + 各语言标题均可命中 */
export function matchLocalizedName(
  folderName: string,
  title: LocalizedText | undefined,
  query: string | undefined,
): boolean {
  const q = (query ?? '').trim().toLowerCase()
  if (!q) return true
  return collectNameVariants(folderName, title).some((name) =>
    name.toLowerCase().includes(q),
  )
}
