import { motion, useReducedMotion } from 'motion/react'
import type { ScreenshotItem } from '@/types/manifest'
import { FavoriteStar } from '@/components/ui/FavoriteStar'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { useLightboxStore } from '@/store/useLightboxStore'
import { cn } from '@/utils/cn'

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
  const caption = showGameName
    ? showFileName
      ? `${item.gameName} · ${item.fileName}`
      : item.gameName
    : showFileName
      ? item.fileName
      : null
  const isFavorite = useGalleryStore((s) => s.isFavorite(item.id))
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite)
  const openAt = useLightboxStore((s) => s.openAt)
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()
  const isExhibition = variant === 'exhibition'
  const plaqueIndex = exhibitIndex ?? index + 1
  const plaqueTotal = exhibitTotal ?? items.length

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
        aria-label={t('viewShot', { name: item.fileName })}
      >
        <motion.div
          layoutId={`shot-${item.id}`}
          className="aspect-video w-full"
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <ImageWithState
            src={item.url}
            alt={item.fileName}
            imgClassName="transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        </motion.div>
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
        <figcaption className="exhibit-caption truncate px-3 py-2 text-[11px] text-muted">
          {item.fileName}
        </figcaption>
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
        !isExhibition && 'overflow-hidden rounded border border-hairline bg-surface',
        isExhibition && 'exhibit-card',
        className,
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
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
