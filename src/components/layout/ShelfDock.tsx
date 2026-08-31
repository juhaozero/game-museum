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

/** 底部浮层控制条：筛选 + 计数 */
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
      <div className="pointer-events-auto glass-panel relative flex max-w-full flex-wrap items-center gap-2 rounded-2xl px-3 py-2 shadow-[0_16px_48px_var(--contact-shadow)] sm:gap-3 sm:rounded-full sm:px-4">
        {showFilter && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors',
                selectedCategory || filterOpen
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-hairline text-muted hover:text-fg',
              )}
            >
              {t('filter')}
              {selectedCategory ? ` · ${selectedCategory}` : ''}
            </button>
            {filterOpen && (
              <div className="glass-panel absolute bottom-full left-0 z-dropdown mb-2 flex max-h-56 min-w-[180px] flex-col gap-1 overflow-y-auto rounded-2xl p-2 shadow-lg">
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
            className="rounded-full px-2.5 py-1.5 text-[11px] text-muted hover:text-fg"
          >
            {t('clearFilters')}
          </button>
        )}

        <span className="px-1 font-mono text-[11px] tabular-nums text-muted">
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
        'rounded-xl px-3 py-2 text-left text-xs transition-colors',
        active
          ? 'bg-accent-soft text-accent'
          : 'text-muted hover:bg-white/5 hover:text-fg',
      )}
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 font-mono opacity-70">{count}</span>
      )}
    </button>
  )
}
