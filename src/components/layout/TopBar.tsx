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

/** 浮层玻璃顶栏（Generated_image） */
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
      'rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] no-underline transition-colors',
      isActive
        ? 'bg-white/10 text-fg shadow-[0_0_20px_var(--shelf-glow-soft)]'
        : 'text-muted hover:bg-white/5 hover:text-fg',
    )

  const toolClass =
    'inline-flex size-9 items-center justify-center rounded-full text-xs text-muted transition-colors hover:bg-white/8 hover:text-fg'

  return (
    <header className="relative z-header px-4 pt-4 md:px-6 lg:px-8">
      <div className="glass-panel flex items-center gap-3 rounded-full px-3 py-2 shadow-[0_12px_40px_var(--contact-shadow)] sm:gap-4 sm:px-4">
        <Link
          to={homeUrl}
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label={t('siteTitle')}
        >
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-xl border border-hairline bg-surface/50 text-accent"
          >
            <MuseumMark />
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="text-[12px] font-semibold tracking-[0.08em] text-fg">
              {t('brandLine1')} {t('brandLine2')}
            </span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-muted">
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
              'w-full rounded-full border border-hairline bg-surface/40 py-2 pl-8 pr-3 text-sm text-fg outline-none placeholder:text-muted focus:border-accent',
              isFiltering && 'pr-12',
              !searchEnabled && 'cursor-not-allowed opacity-50',
            )}
          />
          {isFiltering && searchEnabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted hover:text-fg"
            >
              {t('clear')}
            </button>
          )}
        </label>

        {isFiltering && searchEnabled && filteredCount !== undefined && (
          <span className="hidden font-mono text-[11px] tabular-nums text-muted lg:inline">
            {t('gameCount', { count: filteredCount })}
          </span>
        )}

        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={toggleLocale}
            className={cn(toolClass, 'font-mono text-[10px]')}
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
            <div className="glass-panel absolute right-0 top-full z-dropdown mt-2 flex min-w-[180px] flex-col gap-1 rounded-2xl p-2 shadow-lg">
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
                className="rounded-full px-3.5 py-1.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-muted hover:bg-white/5 hover:text-fg"
              >
                {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full px-3.5 py-1.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-muted hover:bg-white/5 hover:text-fg"
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

function MuseumMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h16M6 20V10l6-4 6 4v10M9 20v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
