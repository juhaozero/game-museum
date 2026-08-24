import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'
/** 展柜列数：2 大图 / 3 宽松（默认）/ 4 标准 */
export type DensityCols = 2 | 3 | 4

type PreferencesState = {
  theme: ThemeMode
  density: DensityCols
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setDensity: (density: DensityCols) => void
}

function applyThemeClass(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function readPersistedTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem('gameshot-preferences')
    if (!raw) return 'dark'
    const parsed = JSON.parse(raw) as { state?: { theme?: ThemeMode } }
    return parsed.state?.theme === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

if (typeof document !== 'undefined') {
  applyThemeClass(readPersistedTheme())
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      density: 3,
      setTheme: (theme) => {
        applyThemeClass(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        set({ theme: next })
      },
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'gameshot-preferences',
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(state.theme)
      },
    },
  ),
)
