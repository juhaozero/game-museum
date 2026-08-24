import { Link, NavLink, useLocation } from 'react-router-dom'
import { useGalleryStore } from '@/store/useGalleryStore'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'
import { buildShelfUrl, isShelfPath } from '@/utils/routes'

type TopBarProps = {
  /** 过滤后游戏数，用于搜索反馈 */
  filteredCount?: number
  isFiltering?: boolean
  onClearFilters?: () => void
}

export function TopBar({
  filteredCount,
  isFiltering = false,
  onClearFilters,
}: TopBarProps) {
  const { theme, density, toggleTheme, setDensity } = usePreferencesStore()
  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const selectedCategory = useGalleryStore((s) => s.selectedCategory)
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery)
  const clearStoreFilters = useGalleryStore((s) => s.clearFilters)
  const homeUrl = buildShelfUrl(selectedCategory, searchQuery)
  const location = useLocation()
  const searchEnabled = isShelfPath(location.pathname)

  const handleClear = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      clearStoreFilters()
    }
  }

  return (
    <header className="relative z-20 flex items-center gap-4 border-b border-hairline bg-bg-elevated/80 px-6 py-3 backdrop-blur-sm md:px-10">
      <Link
        to={homeUrl}
        className="shrink-0 text-sm font-medium tracking-wide text-fg no-underline"
      >
        GameShot Museum
      </Link>

      <label className="relative min-w-0 flex-1">
        <span className="sr-only">搜索游戏</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="搜索游戏…"
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
            清除
          </button>
        )}
      </label>

      {isFiltering && searchEnabled && filteredCount !== undefined && (
        <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">
          {filteredCount} 款
        </span>
      )}

      <nav className="flex shrink-0 items-center gap-1">
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
        >
          收藏
        </NavLink>

        <div
          className="ml-1 flex overflow-hidden rounded border border-hairline"
          role="group"
          aria-label="展柜密度"
        >
          {([2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => setDensity(cols)}
              className={cn(
                'px-2 py-1 text-xs font-mono transition-colors',
                density === cols
                  ? 'bg-accent-soft text-accent'
                  : 'bg-transparent text-muted hover:text-fg',
              )}
              aria-pressed={density === cols}
            >
              {cols}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-1 rounded px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-fg"
          aria-label={theme === 'dark' ? '切换浅色' : '切换深色'}
        >
          {theme === 'dark' ? '浅色' : '深色'}
        </button>
      </nav>
    </header>
  )
}
