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
          <span className="topbar-brand">
            <span className="topbar-brand-title type-metal">
              {locale === 'zh'
                ? `${t('brandLine1')}${t('brandLine2')}`
                : `${t('brandLine1')} ${t('brandLine2')}`}
            </span>
            <span className="topbar-brand-tag hidden sm:block">
              {t('brandTagline')}
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
          <label
            className={cn(
              'topbar-search',
              isFiltering && searchEnabled && 'topbar-search--filtering',
            )}
          >
            <span className="sr-only">{t('searchGames')}</span>
            <span aria-hidden className="topbar-search-icon">
              ⌕
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              disabled={!searchEnabled}
              className="topbar-search-input"
            />
            {isFiltering && searchEnabled && (
              <button
                type="button"
                onClick={handleClear}
                className="topbar-search-clear"
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
                    className="menu-search-input"
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
