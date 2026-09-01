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

/** Arcade Archive · 柜体顶栏（方角 + 可读导航） */
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
    if (onClearFilters) onClearFilters()
    else clearStoreFilters()
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [menuOpen])

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded px-3 py-1.5 text-[13px] font-medium tracking-normal no-underline transition-colors',
      isActive
        ? 'bg-accent text-[var(--bg)]'
        : 'text-muted hover:bg-accent-soft hover:text-accent',
    )

  const toolClass =
    'inline-flex size-9 items-center justify-center rounded border border-transparent text-[12px] font-medium text-muted transition-colors hover:border-[color:var(--cabinet-edge)] hover:bg-accent-soft hover:text-accent'

  return (
    <header className="relative z-header px-4 pt-4 md:px-6 lg:px-8">
      <div className="arcade-panel flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
        <Link
          to={homeUrl}
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label={t('siteTitle')}
        >
          <span
            aria-hidden
            className="type-display flex size-8 items-center justify-center rounded bg-accent text-[12px] font-bold text-[var(--bg)]"
          >
            GM
          </span>
          <span className="hidden min-[420px]:flex flex-col">
            <span className="type-display text-[14px] text-fg">
              {t('brandLine1')}
              <span className="text-accent">{t('brandLine2')}</span>
            </span>
            <span className="type-label text-muted">
              {t('brandTagline')}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navClass}>
            {t('navGallery')}
          </NavLink>
          <NavLink to="/favorites" className={navClass}>
            {t('navFavorites')}
          </NavLink>
        </nav>

        <label className="relative ml-auto min-w-0 flex-1 md:max-w-xs lg:max-w-sm">
          <span className="sr-only">{t('searchGames')}</span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            ⌕
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            disabled={!searchEnabled}
            className={cn(
              'w-full rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] py-2 pl-8 pr-3 text-sm text-fg outline-none placeholder:text-muted focus:border-accent',
              isFiltering && 'pr-12',
              !searchEnabled && 'cursor-not-allowed opacity-50',
            )}
          />
          {isFiltering && searchEnabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 type-label text-muted hover:text-accent"
            >
              {t('clear')}
            </button>
          )}
        </label>

        {isFiltering && searchEnabled && filteredCount !== undefined && (
          <span className="type-label hidden tabular-nums text-muted lg:inline">
            {t('gameCount', { count: filteredCount })}
          </span>
        )}

        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={toggleLocale}
            className={toolClass}
            aria-label={locale === 'zh' ? t('langToEn') : t('langToZh')}
          >
            {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={toolClass}
            aria-label={theme === 'dark' ? t('themeToLight') : t('themeToDark')}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>

        <div className="relative md:hidden" ref={menuRef}>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={t('openMenu')}
            onClick={() => setMenuOpen((v) => !v)}
            className={toolClass}
          >
            ☰
          </button>
          {menuOpen && (
            <div className="arcade-panel absolute right-0 top-full z-dropdown mt-2 flex min-w-[180px] flex-col gap-1 p-2">
              <NavLink
                to="/"
                end
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                {t('navGallery')}
              </NavLink>
              <NavLink
                to="/favorites"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                {t('navFavorites')}
              </NavLink>
              <button
                type="button"
                onClick={toggleLocale}
                className="rounded px-3 py-1.5 text-left text-[13px] font-medium text-muted hover:bg-accent-soft hover:text-accent"
              >
                {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded px-3 py-1.5 text-left text-[13px] font-medium text-muted hover:bg-accent-soft hover:text-accent"
              >
                {theme === 'dark' ? t('themeLight') : t('themeDark')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
