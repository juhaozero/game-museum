import type { ScreenshotItem } from '@/types/manifest'
import { cn } from '@/utils/cn'

type ScreenshotCardProps = {
  item: ScreenshotItem
  showGameName?: boolean
  className?: string
}

/** 阶段 3：普通截图卡片（阶段 4 再接懒加载 / 虚拟列表） */
export function ScreenshotCard({
  item,
  showGameName = true,
  className,
}: ScreenshotCardProps) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded border border-hairline bg-surface',
        className,
      )}
    >
      <img
        src={item.url}
        alt={item.fileName}
        className="aspect-video w-full object-cover"
        loading="lazy"
      />
      <figcaption className="truncate px-2 py-1.5 text-xs text-muted">
        {showGameName ? `${item.gameName} · ${item.fileName}` : item.fileName}
      </figcaption>
    </figure>
  )
}
