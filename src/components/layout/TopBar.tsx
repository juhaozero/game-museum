import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'
import { buildShelfUrl, isShelfPath } from '@/utils/routes'

type TopBarProps = {
  filteredCount?: number
  isFiltering?: boolean
  onClearFilters?: () => void
}

export function TopBar({
  filteredCount,
  isFiltering = false,
  onClearFilters,
}: TopBarProps) {
  const { theme, toggleTheme } = usePreferencesStore()
  const { locale, toggleLocale, t } = useI18n()
  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const selectedCategory = useGalleryStore((s) => s.selectedCategory)
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery)
  const clearStoreFilters = useGalleryStore((s) => s.clearFilters)
  const homeUrl = buildShelfUrl(selectedCategory, searchQuery)
  const location = useLocation()
  const searchEnabled = isShelfPath(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClear = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      clearStoreFilters()
    }
  }

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [menuOpen])

  const tools = (
    <>
      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          cn(
            'rounded px-2.5 py-1.5 text-sm no-underline transition-colors',
            isActive
              ? 'bg-accent-soft text-accent'
              : 'text-muted hover:text-fg',
          )
        }
        onClick={() => setMenuOpen(false)}
      >
        ♥ {t('favorites')}
      </NavLink>

      <button
        type="button"
        onClick={toggleLocale}
        className="rounded px-2.5 py-1.5 font-mono text-xs tabular-nums text-muted transition-colors hover:text-fg"
        aria-label={locale === 'zh' ? t('langToEn') : t('langToZh')}
      >
        {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="rounded px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-fg"
        aria-label={theme === 'dark' ? t('themeToLight') : t('themeToDark')}
      >
        {theme === 'dark' ? t('themeLight') : t('themeDark')}
      </button>
    </>
  )

  return (
    <header className="relative z-header flex items-center gap-3 border-b border-hairline bg-bg-elevated/80 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-6 md:px-10">
      <Link
        to={homeUrl}
        className="shrink-0 text-sm font-medium text-fg no-underline"
      >
        {t('siteTitle')}
      </Link>

      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{t('searchGames')}</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          disabled={!searchEnabled}
          className={cn(
            'w-full max-w-xl rounded border border-hairline bg-surface px-3 py-1.5 text-sm text-fg outline-none placeholder:text-muted focus:border-accent',
            isFiltering && 'pr-14',
            !searchEnabled && 'cursor-not-allowed opacity-60',
          )}
        />
        {isFiltering && searchEnabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-xs text-muted hover:text-fg"
          >
            {t('clear')}
          </button>
        )}
      </label>

      {isFiltering && searchEnabled && filteredCount !== undefined && (
        <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted sm:inline">
          {t('gameCount', { count: filteredCount })}
        </span>
      )}

      {/* ≥768：工具常显 */}
      <nav className="hidden shrink-0 items-center gap-1 md:flex">{tools}</nav>

      {/* <768：收进菜单 */}
      <div className="relative shrink-0 md:hidden" ref={menuRef}>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={t('openMenu')}
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded px-2.5 py-1.5 text-sm text-muted hover:text-fg"
        >
          {t('menu')}
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full z-dropdown mt-1 flex min-w-[160px] flex-col gap-1 rounded border border-hairline bg-bg-elevated p-2 shadow-md">
            {tools}
          </div>
        )}
      </div>
    </header>
  )
}
