import type { ScreenshotItem } from '@/types/manifest'
import { ScreenshotCard } from '@/components/gallery/ScreenshotCard'
import { cn } from '@/utils/cn'

type ScreenshotGridProps = {
  items: ScreenshotItem[]
  showGameName?: boolean
  className?: string
  emptyMessage?: string
}

/** 普通截图网格（非虚拟列表） */
export function ScreenshotGrid({
  items,
  showGameName = true,
  className,
  emptyMessage = '暂无截图',
}: ScreenshotGridProps) {
  if (items.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>
  }

  return (
    <ul
      className={cn(
        'grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <ScreenshotCard item={item} showGameName={showGameName} />
        </li>
      ))}
    </ul>
  )
}
