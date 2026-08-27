import type { DensityCols } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'

type ShelfSkeletonProps = {
  density: DensityCols
}

/** Manifest 加载中的盒墙骨架 */
export function ShelfSkeleton({ density }: ShelfSkeletonProps) {
  const count = density === 2 ? 4 : density === 3 ? 6 : 8

  return (
    <ul
      aria-busy="true"
      aria-label="加载中"
      className={cn(
        'mx-auto grid max-w-7xl list-none gap-7 p-0 md:gap-9 lg:gap-10',
        density === 2 && 'grid-cols-1 sm:grid-cols-2',
        density === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        density === 4 && 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="mx-auto w-full max-w-[240px]">
          <div className="aspect-[135/170] animate-pulse rounded-md bg-surface" />
        </li>
      ))}
    </ul>
  )
}
