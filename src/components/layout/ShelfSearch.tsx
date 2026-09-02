import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { cn } from '@/utils/cn'

type ShelfSearchProps = {
  filteredCount?: number
  isFiltering?: boolean
  onClear?: () => void
  className?: string
}

/** 操作台搜索槽（柜体面板） */
export function ShelfSearch({
  filteredCount,
  isFiltering = false,
  onClear,
  className,
}: ShelfSearchProps) {
  const { t } = useI18n()
  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery)

  return (
    <div className={cn('shelf-search', className)}>
      <p className="type-label mb-2.5 text-accent">{t('searchGames')}</p>
      <div className="flex items-stretch gap-2">
        <label className="shelf-search-slot relative min-w-0 flex-1">
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
            className={cn(
              'w-full rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] py-2.5 pl-8 pr-3 text-sm text-fg outline-none placeholder:text-muted focus:border-accent',
              isFiltering && onClear && 'pr-14',
            )}
          />
          {isFiltering && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 type-label text-muted hover:text-accent"
            >
              {t('clear')}
            </button>
          )}
        </label>
      </div>
      {isFiltering && filteredCount !== undefined && (
        <p className="type-label mt-2.5 tabular-nums text-muted">
          {t('gameCount', { count: filteredCount })}
        </p>
      )}
    </div>
  )
}
