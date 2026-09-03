import { useI18n } from '@/i18n/useI18n'

/** 馆藏加载骨架：左 Hero + 右封面墙 */
export function ShelfSkeleton() {
  const { t } = useI18n()

  return (
    <div
      aria-busy="true"
      aria-label={t('loading')}
      className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(22rem,0.4fr)_minmax(0,1fr)] lg:gap-12"
    >
      <div className="space-y-4">
        <div className="h-10 w-4/5 animate-pulse rounded-md bg-surface" />
        <div className="h-16 w-full animate-pulse rounded-md bg-surface/70" />
        <div className="h-10 w-full animate-pulse rounded-md bg-surface/50" />
      </div>
      <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="relative">
            <div className="cart-cover aspect-[2/3] animate-pulse bg-surface opacity-60" />
            <span className="cart-shelf-glow opacity-30" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  )
}
