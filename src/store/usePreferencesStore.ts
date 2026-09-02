import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n/messages'
import { translate } from '@/i18n/messages'
import { publicUiEnv } from '@/utils/publicEnv'

export type ThemeMode = 'light' | 'dark'

type PreferencesState = {
  theme: ThemeMode
  locale: Locale
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

type PersistedSlice = {
  theme?: ThemeMode
  locale?: Locale
}

function resolveTheme(theme: ThemeMode): ThemeMode {
  if (!publicUiEnv.enableLightMode) return 'dark'
  return theme
}

function applyThemeClass(theme: ThemeMode) {
  document.documentElement.classList.toggle(
    'dark',
    resolveTheme(theme) === 'dark',
  )
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  document.title = translate(locale, 'siteTitle')
}

function readPersisted(): { theme: ThemeMode; locale: Locale } {
  try {
    const raw = localStorage.getItem('gameshot-preferences')
    if (!raw) return { theme: 'dark', locale: 'zh' }
    const parsed = JSON.parse(raw) as { state?: PersistedSlice }
    const theme = parsed.state?.theme === 'light' ? 'light' : 'dark'
    const locale = parsed.state?.locale === 'en' ? 'en' : 'zh'
    return { theme: resolveTheme(theme), locale }
  } catch {
    return { theme: 'dark', locale: 'zh' }
  }
}

if (typeof document !== 'undefined') {
  const { theme, locale } = readPersisted()
  applyThemeClass(theme)
  applyLocale(locale)
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      locale: 'zh',
      setTheme: (theme) => {
        const next = resolveTheme(theme)
        applyThemeClass(next)
        set({ theme: next })
      },
      toggleTheme: () => {
        if (!publicUiEnv.enableLightMode) {
          applyThemeClass('dark')
          set({ theme: 'dark' })
          return
        }
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        set({ theme: next })
      },
      setLocale: (locale) => {
        applyLocale(locale)
        set({ locale })
      },
      toggleLocale: () => {
        const next = get().locale === 'zh' ? 'en' : 'zh'
        applyLocale(next)
        set({ locale: next })
      },
    }),
    {
      name: 'gameshot-preferences',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const theme = resolveTheme(state.theme)
        if (theme !== state.theme) state.theme = theme
        applyThemeClass(theme)
        applyLocale(state.locale)
      },
    },
  ),
)
