import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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
  const { theme, density, toggleTheme, setDensity } = usePreferencesStore()
  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const selectedCategory = useGalleryStore((s) => s.selectedCategory)
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery)
  const clearStoreFilters = useGalleryStore((s) => s.clearFilters)
  const homeUrl = buildShelfUrl(selectedCategory, searchQuery)
  const location = useLocation()
  const searchEnabled = isShelfPath(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(location.pathname)
  const menuRef = useRef<HTMLDivElement>(null)

  if (location.pathname !== menuPath) {
    setMenuPath(location.pathname)
    if (menuOpen) setMenuOpen(false)
  }

  const handleClear = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      clearStoreFilters()
    }
  }

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
        收藏
      </NavLink>

      <div
        className="flex overflow-hidden rounded border border-hairline"
        role="group"
        aria-label="展柜密度"
      >
        {([2, 3, 4] as const).map((cols) => (
          <button
            key={cols}
            type="button"
            onClick={() => setDensity(cols)}
            className={cn(
              'px-2 py-1 font-mono text-xs tabular-nums transition-colors',
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
        className="rounded px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-fg"
        aria-label={theme === 'dark' ? '切换浅色' : '切换深色'}
      >
        {theme === 'dark' ? '浅色' : '深色'}
      </button>
    </>
  )

  return (
    <header className="relative z-header flex items-center gap-3 border-b border-hairline bg-bg-elevated/80 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-6 md:px-10">
      <Link
        to={homeUrl}
        className="shrink-0 text-sm font-medium text-fg no-underline"
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
        <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted sm:inline">
          {filteredCount} 款
        </span>
      )}

      {/* ≥768：工具常显 */}
      <nav className="hidden shrink-0 items-center gap-1 md:flex">{tools}</nav>

      {/* <768：收进菜单 */}
      <div className="relative shrink-0 md:hidden" ref={menuRef}>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label="打开菜单"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded px-2.5 py-1.5 text-sm text-muted hover:text-fg"
        >
          菜单
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
