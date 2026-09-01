import type { CategorySummary } from '@/types/manifest'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type CategoryChipsProps = {
  categories: CategorySummary[]
  selectedCategory: string | null
  onSelect: (category: string | null) => void
}

/** 浮层圆角 Chip，呼应图3顶栏 */
export function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
}: CategoryChipsProps) {
  const { t } = useI18n()

  if (categories.length <= 1) return null

  return (
    <div className="relative z-header px-3 pt-2 sm:px-4 md:px-5">
      <div
        className="flex gap-2 overflow-x-auto rounded-full border border-hairline bg-bg-elevated/40 px-2 py-1.5 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={t('categories')}
      >
        <Chip
          active={selectedCategory === null}
          onClick={() => onSelect(null)}
          label={t('allCategories')}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.name}
            active={selectedCategory === cat.name}
            onClick={() => onSelect(cat.name)}
            label={cat.name}
            count={cat.gameCount}
          />
        ))}
      </div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-3 py-1 text-xs transition-colors',
        active
          ? 'border-accent bg-accent-soft text-accent shadow-[0_0_12px_var(--shelf-glow-soft)]'
          : 'border-transparent text-muted hover:border-hairline hover:text-fg',
      )}
    >
      {label}
      {count !== undefined && (
        <span className="type-label ml-1.5 opacity-70">{count}</span>
      )}
    </button>
  )
}
