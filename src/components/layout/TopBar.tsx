import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'
import { publicUiEnv } from '@/utils/publicEnv'
import { buildShelfUrl, isShelfPath } from '@/utils/routes'

type TopBarProps = {
  filteredCount?: number
  isFiltering?: boolean
  onClearFilters?: () => void
}

/** 薄品牌灯箱：左品牌导航 · 右上搜索 + 工具 */
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
    cn('topbar-nav', isActive && 'topbar-nav--active')

  const toolClass = 'topbar-tool'

  return (
    <header className="topbar relative z-header">
      <div className="topbar-inner">
        <Link
          to={homeUrl}
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label={t('siteTitle')}
        >
          <span aria-hidden className="topbar-mark">
            GM
          </span>
          <span className="hidden min-[420px]:flex flex-col gap-0.5">
            <span className="type-display text-[14px] leading-snug text-fg sm:text-[15px]">
              {t('brandLine1')}
              <span className="text-accent">{t('brandLine2')}</span>
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex md:ml-8">
          <NavLink to="/" end className={navClass}>
            {t('navGallery')}
          </NavLink>
          <NavLink to="/favorites" className={navClass}>
            {t('navFavorites')}
          </NavLink>
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <label className="topbar-search relative hidden min-w-0 sm:block sm:w-44 md:w-56 lg:w-64">
            <span className="sr-only">{t('searchGames')}</span>
            <span
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted"
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
                'w-full rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] py-1.5 pl-7 pr-2 text-[13px] text-fg outline-none placeholder:text-muted focus:border-accent',
                isFiltering && searchEnabled && 'pr-10',
                !searchEnabled && 'cursor-not-allowed opacity-45',
              )}
            />
            {isFiltering && searchEnabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 type-label text-[10px] text-muted hover:text-accent"
              >
                {t('clear')}
              </button>
            )}
          </label>

          {isFiltering && searchEnabled && filteredCount !== undefined && (
            <span className="type-label hidden shrink-0 tabular-nums text-muted xl:inline">
              {t('gameCount', { count: filteredCount })}
            </span>
          )}

          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={toggleLocale}
              className={toolClass}
              aria-label={locale === 'zh' ? t('langToEn') : t('langToZh')}
            >
              {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
            </button>
            {publicUiEnv.enableLightMode && (
              <button
                type="button"
                onClick={toggleTheme}
                className={toolClass}
                aria-label={
                  theme === 'dark' ? t('themeToLight') : t('themeToDark')
                }
              >
                {theme === 'dark' ? t('themeLight') : t('themeDark')}
              </button>
            )}
          </div>

          <div className="relative shrink-0 md:hidden" ref={menuRef}>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={t('openMenu')}
              onClick={() => setMenuOpen((v) => !v)}
              className={toolClass}
            >
              {t('menu')}
            </button>
            {menuOpen && (
              <div className="arcade-panel absolute right-0 top-full z-dropdown mt-2 flex min-w-[220px] flex-col gap-2 p-2">
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
                <label className="relative block sm:hidden">
                  <span className="sr-only">{t('searchGames')}</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    disabled={!searchEnabled}
                    className={cn(
                      'w-full rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] px-2.5 py-2 text-[13px] text-fg outline-none placeholder:text-muted focus:border-accent',
                      !searchEnabled && 'cursor-not-allowed opacity-45',
                    )}
                  />
                </label>
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="rounded px-3 py-1.5 text-left text-[13px] font-medium text-muted hover:bg-accent-soft hover:text-accent"
                >
                  {locale === 'zh' ? t('langLabelEn') : t('langLabel')}
                </button>
                {publicUiEnv.enableLightMode && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded px-3 py-1.5 text-left text-[13px] font-medium text-muted hover:bg-accent-soft hover:text-accent"
                  >
                    {theme === 'dark' ? t('themeLight') : t('themeDark')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
