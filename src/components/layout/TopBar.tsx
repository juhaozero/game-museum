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
  const shelfNavActive = isShelfPath(location.pathname)
  const favoritesNavActive = location.pathname.startsWith('/favorites')
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const toolClass = 'topbar-tool'

  return (
    <header className="topbar z-header">
      <div className="topbar-inner">
        <Link
          to={homeUrl}
          className="flex min-w-0 shrink-0 items-center gap-2.5 no-underline"
          aria-label={t('siteTitle')}
        >
          <span aria-hidden className="topbar-mark">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 壳体描边 */}
              <rect
                x="3"
                y="8"
                width="26"
                height="13"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              {/* 标签底板 */}
              <rect
                x="6"
                y="10.5"
                width="16.5"
                height="8"
                rx="1.25"
                fill="currentColor"
                opacity="0.22"
              />
              {/* 暂停：主识别 */}
              <rect
                x="10"
                y="12.25"
                width="2.75"
                height="4.5"
                rx="0.55"
                fill="currentColor"
              />
              <rect
                x="15.25"
                y="12.25"
                width="2.75"
                height="4.5"
                rx="0.55"
                fill="currentColor"
              />
              {/* 右侧触点 */}
              <rect x="24" y="11.5" width="2.5" height="1.4" rx="0.35" fill="currentColor" />
              <rect x="24" y="13.8" width="2.5" height="1.4" rx="0.35" fill="currentColor" />
              <rect x="24" y="16.1" width="2.5" height="1.4" rx="0.35" fill="currentColor" />
              {/* 底部插针 */}
              <rect x="7" y="22.5" width="2.4" height="3.2" rx="0.45" fill="currentColor" />
              <rect x="11.2" y="22.5" width="2.4" height="3.2" rx="0.45" fill="currentColor" />
              <rect x="15.4" y="22.5" width="2.4" height="3.2" rx="0.45" fill="currentColor" />
              <rect x="19.6" y="22.5" width="2.4" height="3.2" rx="0.45" fill="currentColor" />
              <rect x="23.8" y="22.5" width="2.4" height="3.2" rx="0.45" fill="currentColor" />
            </svg>
          </span>
          <span className="topbar-brand">
            <span className="topbar-brand-title topbar-brand-title--short type-metal">
              {t('brandShort')}
            </span>
            <span className="topbar-brand-title topbar-brand-title--full type-metal">
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
          <NavLink
            to="/"
            end
            className={() =>
              cn('topbar-nav', shelfNavActive && 'topbar-nav--active')
            }
            aria-current={shelfNavActive ? 'page' : undefined}
          >
            {t('navGallery')}
          </NavLink>
          <NavLink
            to="/favorites"
            className={() =>
              cn('topbar-nav', favoritesNavActive && 'topbar-nav--active')
            }
            aria-current={favoritesNavActive ? 'page' : undefined}
          >
            {t('navFavorites')}
          </NavLink>
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          {searchEnabled && (
            <label
              className={cn(
                'topbar-search',
                isFiltering && 'topbar-search--filtering',
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
                className="topbar-search-input"
              />
              {isFiltering && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="topbar-search-clear"
                >
                  {t('clear')}
                </button>
              )}
            </label>
          )}

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
                  className={() =>
                    cn('topbar-nav', shelfNavActive && 'topbar-nav--active')
                  }
                  aria-current={shelfNavActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navGallery')}
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={() =>
                    cn('topbar-nav', favoritesNavActive && 'topbar-nav--active')
                  }
                  aria-current={favoritesNavActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navFavorites')}
                </NavLink>
                {searchEnabled && (
                  <label className="relative block sm:hidden">
                    <span className="sr-only">{t('searchGames')}</span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="menu-search-input"
                    />
                  </label>
                )}
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
