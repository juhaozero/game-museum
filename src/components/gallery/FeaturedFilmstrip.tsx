import { useMemo } from 'react'
import { useReducedMotion } from 'motion/react'
import type { FeaturedExhibitItem } from '@/types/manifest'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useI18n } from '@/i18n/useI18n'
import { useLightboxStore } from '@/store/useLightboxStore'
import { cn } from '@/utils/cn'

type FeaturedFilmstripProps = {
  items: FeaturedExhibitItem[]
  /** Lightbox 浏览全集（默认同 items） */
  lightboxPool?: FeaturedExhibitItem[]
  /** manifest.featured.labels 覆盖 i18n */
  title?: string
  hint?: string
  /** compact = Hero 侧栏；wide = 全宽横条 */
  variant?: 'compact' | 'wide'
  className?: string
}

/** 精选截图 filmstrip：点击进 Lightbox，多条时自动滚动 */
export function FeaturedFilmstrip({
  items,
  lightboxPool,
  title,
  hint,
  variant = 'compact',
  className,
}: FeaturedFilmstripProps) {
  const { t } = useI18n()
  const openAt = useLightboxStore((s) => s.openAt)
  const reduceMotion = useReducedMotion()
  const pool = lightboxPool ?? items

  const trackItems = useMemo(() => {
    if (items.length <= 1) return items
    return [...items, ...items]
  }, [items])

  if (items.length === 0) return null

  const isWide = variant === 'wide'
  const scrollThreshold = isWide ? 2 : 3
  const canScroll = items.length >= scrollThreshold && !reduceMotion
  const stripTitle = title?.trim() || t('featuredTitle')
  const stripHint = hint?.trim() || t('featuredHint')

  return (
    <section
      className={cn('filmstrip', isWide && 'filmstrip--wide', className)}
      aria-label={stripTitle}
    >
      <div className="filmstrip-head">
        <span className="filmstrip-label">{stripTitle}</span>
        <span className="filmstrip-hint">
          {stripHint}
          <span className="filmstrip-count" aria-hidden>
            · {items.length}
          </span>
        </span>
      </div>
      <div
        className={cn(
          'filmstrip-viewport',
          canScroll && 'filmstrip-viewport--scroll',
        )}
      >
        <ul
          className={cn(
            'filmstrip-track',
            canScroll && 'filmstrip-track--animate',
          )}
        >
          {trackItems.map((item, i) => {
            const indexInPool = pool.findIndex((s) => s.id === item.id)
            const openIndex = indexInPool >= 0 ? indexInPool : 0
            const plaqueTitle = item.caption?.trim() || item.gameName
            const plaqueSub =
              item.caption?.trim() && item.caption.trim() !== item.gameName
                ? item.gameName
                : null

            return (
              <li key={`${item.id}-${i}`} className="filmstrip-item">
                <button
                  type="button"
                  className="group filmstrip-shot exhibit-frame"
                  onClick={() => openAt(pool, openIndex)}
                  aria-label={t('viewShot', {
                    name: item.caption?.trim() || item.gameName,
                  })}
                >
                  <span
                    className={cn(
                      'exhibit-plaque',
                      plaqueSub && 'exhibit-plaque--stacked',
                    )}
                    aria-hidden
                  >
                    <span className="exhibit-plaque-title">{plaqueTitle}</span>
                    {plaqueSub && (
                      <span className="exhibit-plaque-sub">{plaqueSub}</span>
                    )}
                  </span>
                  <div
                    className={cn(
                      'aspect-video shrink-0 overflow-hidden',
                      isWide
                        ? 'w-[240px] sm:w-[280px] lg:w-[300px]'
                        : 'w-[200px] sm:w-[220px]',
                    )}
                  >
                    <ImageWithState
                      src={item.url}
                      alt=""
                      fallbackGlyph={item.gameName.slice(0, 1)}
                      imgClassName="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
