/** Manifest 加载中的盒墙骨架（固定宽松 3 列，gap 32px） */
import { useI18n } from '@/i18n/useI18n'

export function ShelfSkeleton() {
  const { t } = useI18n()

  return (
    <ul
      aria-busy="true"
      aria-label={t('loading')}
      className="mx-auto grid max-w-7xl list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="mx-auto w-full max-w-[240px]">
          <div className="aspect-[135/170] animate-pulse rounded-md bg-surface" />
        </li>
      ))}
    </ul>
  )
}
