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
}

/** Level 2 展墙卡片：16:9 裁切 · hover 星标 · 点击进 Lightbox */
export function ScreenshotCard({
  item,
  items,
  index,
  showGameName = true,
  showFileName = true,
  className,
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

  return (
    <motion.figure
      layout={!reduceMotion}
      className={cn(
        'group relative overflow-hidden rounded border border-hairline bg-surface',
        className,
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
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
            imgClassName="transition-transform duration-200 ease-out group-hover:scale-[1.02]"
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

      {caption && (
        <figcaption className="truncate px-2 py-1.5 text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
