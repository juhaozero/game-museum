import type { CategorySummary } from '@/types/manifest'
import { cn } from '@/utils/cn'

type CategoryChipsProps = {
  categories: CategorySummary[]
  selectedCategory: string | null
  onSelect: (category: string | null) => void
}

/** 顶栏轻量分类筛选（无侧栏） */
export function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
}: CategoryChipsProps) {
  if (categories.length <= 1) return null

  return (
    <div className="relative z-20 border-b border-hairline bg-bg-elevated/60 px-6 py-2 backdrop-blur-sm md:px-10">
      <div
        className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="游戏分类"
      >
        <Chip
          active={selectedCategory === null}
          onClick={() => onSelect(null)}
          label="全部"
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
          ? 'border-accent bg-accent-soft text-accent'
          : 'border-hairline text-muted hover:text-fg',
      )}
    >
      {label}
      {count !== undefined && (
        <span className="ml-1 font-mono opacity-70">{count}</span>
      )}
    </button>
  )
}
