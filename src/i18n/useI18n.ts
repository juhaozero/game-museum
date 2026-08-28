import { usePreferencesStore } from '@/store/usePreferencesStore'
import {
  translate,
  type InterpValues,
  type Locale,
  type MessageKey,
} from '@/i18n/messages'

export function useI18n() {
  const locale = usePreferencesStore((s) => s.locale)
  const setLocale = usePreferencesStore((s) => s.setLocale)
  const toggleLocale = usePreferencesStore((s) => s.toggleLocale)

  const t = (key: MessageKey, values?: InterpValues) =>
    translate(locale, key, values)

  return { locale, setLocale, toggleLocale, t } as const
}

export type { Locale, MessageKey }
