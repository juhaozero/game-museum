import { motion, useReducedMotion } from 'motion/react'
import type { ScreenshotItem } from '@/types/manifest'
import { FavoriteStar } from '@/components/ui/FavoriteStar'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { useLightboxStore } from '@/store/useLightboxStore'
import { cn } from '@/utils/cn'
import { displayGameName, pickLocalized } from '@/utils/localized'

type ScreenshotCardProps = {
  item: ScreenshotItem
  items: ScreenshotItem[]
  index: number
  showGameName?: boolean
  showFileName?: boolean
  className?: string
  variant?: 'default' | 'exhibition'
  exhibitIndex?: number
  exhibitTotal?: number
}

/** 展墙卡片：默认网格 / exhibition 画框 + 序号牌 */
export function ScreenshotCard({
  item,
  items,
  index,
  showGameName = true,
  showFileName = true,
  className,
  variant = 'default',
  exhibitIndex,
  exhibitTotal,
}: ScreenshotCardProps) {
  const { t, locale } = useI18n()
  const shownGameName = displayGameName(item.gameName, item.gameTitle, locale)
  const exhibitCaption = pickLocalized(item.caption, locale)
  const metaLine = showGameName
    ? showFileName
      ? `${shownGameName} · ${item.fileName}`
      : shownGameName
    : showFileName
      ? item.fileName
      : null
  const caption = exhibitCaption || metaLine
  const isFavorite = useGalleryStore((s) => s.isFavorite(item.id))
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite)
  const openAt = useLightboxStore((s) => s.openAt)
  const reduceMotion = useReducedMotion()
  const isExhibition = variant === 'exhibition'
  const plaqueIndex = exhibitIndex ?? index + 1
  const plaqueTotal = exhibitTotal ?? items.length
  const viewLabel = exhibitCaption || item.fileName

  const cardBody = (
    <>
      {isExhibition && (
        <span className="exhibit-index" aria-hidden>
          {t('exhibitIndex', {
            index: String(plaqueIndex).padStart(2, '0'),
            total: String(plaqueTotal).padStart(2, '0'),
          })}
        </span>
      )}

      <button
        type="button"
        onClick={() => openAt(items, index)}
        className="relative block w-full cursor-zoom-in overflow-hidden text-left"
        aria-label={t('viewShot', { name: viewLabel })}
      >
        <motion.div
          layoutId={`shot-${item.id}`}
          className="aspect-video w-full"
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <ImageWithState
            src={item.url}
            alt={viewLabel}
            imgClassName="transition-opacity duration-200"
          />
        </motion.div>

        {isExhibition && exhibitCaption && (
          <span className="exhibit-plaque exhibit-plaque--stacked" aria-hidden>
            <span className="exhibit-plaque-title">{exhibitCaption}</span>
            {showGameName && (
              <span className="exhibit-plaque-sub">{shownGameName}</span>
            )}
          </span>
        )}
      </button>

      <div className="pointer-events-none absolute right-2 top-2 z-[1]">
        <div className="pointer-events-auto">
          <FavoriteStar
            active={isFavorite}
            onToggle={() => toggleFavorite(item.id)}
          />
        </div>
      </div>

      {isExhibition ? (
        !exhibitCaption && caption ? (
          <figcaption className="exhibit-caption truncate px-3 py-2 text-[11px] text-muted">
            {caption}
          </figcaption>
        ) : null
      ) : (
        caption && (
          <figcaption className="truncate px-2 py-1.5 text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {caption}
          </figcaption>
        )
      )}
    </>
  )

  return (
    <motion.figure
      layout={!reduceMotion}
      className={cn(
        'group relative',
        !isExhibition &&
          'overflow-hidden rounded border border-hairline bg-surface',
        isExhibition && 'exhibit-card',
        className,
      )}
      initial={
        isExhibition || reduceMotion ? false : { opacity: 0, y: 16 }
      }
      whileInView={
        isExhibition || reduceMotion ? undefined : { opacity: 1, y: 0 }
      }
      viewport={
        isExhibition ? undefined : { once: true, margin: '0px 0px -40px 0px' }
      }
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {isExhibition ? (
        <div className="exhibit-frame exhibit-frame--wall overflow-hidden bg-box-inner">
          {cardBody}
        </div>
      ) : (
        cardBody
      )}

      {isExhibition && <span className="exhibit-shelf-glow" aria-hidden />}
    </motion.figure>
  )
}
