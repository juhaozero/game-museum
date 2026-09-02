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
