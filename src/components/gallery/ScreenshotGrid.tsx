import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ScreenshotItem } from '@/types/manifest'
import { ScreenshotCard } from '@/components/gallery/ScreenshotCard'
import { ExhibitEmptyState } from '@/components/ui/ExhibitEmptyState'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type ScreenshotGridProps = {
  items: ScreenshotItem[]
  showGameName?: boolean
  showFileName?: boolean
  className?: string
  emptyMessage?: string
  variant?: 'default' | 'exhibition'
}

/** 截图网格 / 展厅展墙（exhibition = 不对称 12 列；大列表 content-visibility） */
export function ScreenshotGrid({
  items,
  showGameName = true,
  showFileName = true,
  className,
  emptyMessage,
  variant = 'default',
}: ScreenshotGridProps) {
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()
  const isExhibition = variant === 'exhibition'

  if (items.length === 0) {
    return (
      <ExhibitEmptyState
        eyebrow={t('emptyEyebrowShelf')}
        title={emptyMessage ?? t('noScreenshots')}
      />
    )
  }

  const stagger = reduceMotion ? 0 : isExhibition ? 0.055 : 0.04

  return (
    <motion.ul
      className={cn(
        'list-none p-0',
        isExhibition
          ? 'exhibit-grid'
          : 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: reduceMotion ? 0 : isExhibition ? 0.2 : 0,
          },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            layout={!reduceMotion}
            className={cn(isExhibition && index === 0 && 'exhibit-lead')}
            variants={{
              hidden: reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: isExhibition ? 14 : 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.34, ease: 'easeOut' },
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ layout: { duration: 0.28, ease: 'easeOut' } }}
          >
            <ScreenshotCard
              item={item}
              items={items}
              index={index}
              showGameName={showGameName}
              showFileName={showFileName}
              variant={variant}
              exhibitIndex={index + 1}
              exhibitTotal={items.length}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
