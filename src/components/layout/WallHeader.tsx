import type { CategorySummary } from '@/types/manifest'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type WallHeaderProps = {
  categories: CategorySummary[]
  selectedCategory: string | null
  shown: number
  total: number
  isFiltering: boolean
  onSelectCategory: (category: string | null) => void
  onClear: () => void
}

/** 展墙头：分类灯条 + 计数，与封面墙同一构图 */
export function WallHeader({
  categories,
  selectedCategory,
  shown,
  total,
  isFiltering,
  onSelectCategory,
  onClear,
}: WallHeaderProps) {
  const { t } = useI18n()
  const showFilter = categories.length > 1

  return (
    <div className="wall-header mb-4 lg:mb-5">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-2">
        <p className="type-label inline-flex shrink-0 items-center gap-2 text-accent">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-[1px] bg-accent"
          />
          {t('exhibitWall')}
        </p>

        {showFilter && (
          <nav
            className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={t('categories')}
          >
            <WallTab
              active={selectedCategory === null}
              label={t('allCategories')}
              onClick={() => onSelectCategory(null)}
            />
            {categories.map((cat) => (
              <WallTab
                key={cat.name}
                active={selectedCategory === cat.name}
                label={cat.name}
                count={cat.gameCount}
                onClick={() => onSelectCategory(cat.name)}
              />
            ))}
          </nav>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {isFiltering && (
            <button
              type="button"
              onClick={onClear}
              className="type-label text-muted transition-colors hover:text-accent"
            >
              {t('clearFilters')}
            </button>
          )}
          <span className="type-label tabular-nums text-muted">
            {t('displaying', { shown, total })}
          </span>
        </div>
      </div>
    </div>
  )
}

function WallTab({
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
      className={cn('wall-header-tab', active && 'wall-header-tab--active')}
    >
      {label}
      {count !== undefined && (
        <span className="ml-1 opacity-65 tabular-nums">{count}</span>
      )}
    </button>
  )
}
