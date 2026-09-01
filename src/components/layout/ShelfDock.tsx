import { useState } from 'react'
import type { CategorySummary } from '@/types/manifest'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type ShelfDockProps = {
  shown: number
  total: number
  categories: CategorySummary[]
  selectedCategory: string | null
  isFiltering: boolean
  onSelectCategory: (category: string | null) => void
  onClear: () => void
}

/** Arcade Archive · 底部柜体导览：主题筛选 + 计数 */
export function ShelfDock({
  shown,
  total,
  categories,
  selectedCategory,
  isFiltering,
  onSelectCategory,
  onClear,
}: ShelfDockProps) {
  const { t } = useI18n()
  const [filterOpen, setFilterOpen] = useState(false)
  const showFilter = categories.length > 1

  return (
    <div className="pointer-events-none sticky bottom-4 z-dock mt-8 flex justify-center px-1">
      <div className="pointer-events-auto arcade-panel relative flex max-w-full flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        {showFilter && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className={cn(
                'rounded border px-3 py-1.5 text-[13px] font-medium transition-colors',
                selectedCategory || filterOpen
                  ? 'border-accent bg-accent text-[var(--bg)]'
                  : 'border-[color:var(--cabinet-edge)] text-muted hover:border-accent hover:text-accent',
              )}
            >
              {t('filter')}
              {selectedCategory ? ` · ${selectedCategory}` : ''}
            </button>
            {filterOpen && (
              <div className="arcade-panel absolute bottom-full left-0 z-dropdown mb-2 flex max-h-56 min-w-[180px] flex-col gap-1 overflow-y-auto p-2">
                <DockChip
                  active={selectedCategory === null}
                  label={t('allCategories')}
                  onClick={() => {
                    onSelectCategory(null)
                    setFilterOpen(false)
                  }}
                />
                {categories.map((cat) => (
                  <DockChip
                    key={cat.name}
                    active={selectedCategory === cat.name}
                    label={cat.name}
                    count={cat.gameCount}
                    onClick={() => {
                      onSelectCategory(cat.name)
                      setFilterOpen(false)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {isFiltering && (
          <button
            type="button"
            onClick={onClear}
            className="rounded px-2.5 py-1.5 text-[13px] text-muted hover:text-accent"
          >
            {t('clearFilters')}
          </button>
        )}

        <span className="type-label px-1 tabular-nums text-muted">
          {t('displaying', { shown, total })}
        </span>
      </div>
    </div>
  )
}

function DockChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded px-3 py-2 text-left text-[13px] transition-colors',
        active
          ? 'bg-accent text-[var(--bg)]'
          : 'text-muted hover:bg-accent-soft hover:text-accent',
      )}
    >
      {label}
      {count !== undefined && (
        <span className="type-label ml-2 opacity-70">{count}</span>
      )}
    </button>
  )
}
