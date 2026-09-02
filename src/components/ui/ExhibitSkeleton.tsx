import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type ExhibitSkeletonProps = {
  count?: number
  className?: string
}

/** 展墙加载骨架：exhibit-frame 形态 + 首图放大 */
export function ExhibitSkeleton({
  count = 6,
  className,
}: ExhibitSkeletonProps) {
  const { t } = useI18n()

  return (
    <div
      aria-busy="true"
      aria-label={t('loading')}
      className={cn('exhibit-page mx-auto max-w-6xl space-y-8', className)}
    >
      <div className="exhibit-header space-y-4 pb-5">
        <div className="h-3 w-28 animate-pulse rounded-sm bg-surface" />
        <div className="flex items-end gap-6">
          <div className="cart-cover aspect-[2/3] w-[120px] shrink-0 animate-pulse opacity-50 sm:w-[140px]" />
          <div className="min-w-0 flex-1 space-y-3 pb-1">
            <div className="h-3 w-24 animate-pulse rounded-sm bg-accent-soft" />
            <div className="h-8 w-2/3 max-w-sm animate-pulse rounded-sm bg-surface" />
            <div className="h-3 w-36 animate-pulse rounded-sm bg-surface/70" />
          </div>
        </div>
      </div>

      <ul className="exhibit-grid">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={cn('relative', i === 0 && 'exhibit-lead')}>
            <div className="exhibit-frame exhibit-frame--wall overflow-hidden bg-box-inner">
              <div className="aspect-video animate-pulse bg-surface/40" />
              <div className="exhibit-caption h-8 animate-pulse bg-surface/30" />
            </div>
            <span className="exhibit-shelf-glow opacity-30" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  )
}
