import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ScreenshotItem } from '@/types/manifest'
import { ScreenshotCard } from '@/components/gallery/ScreenshotCard'
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

/** 截图网格 / 展厅展墙 */
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
      <p className="text-pretty text-muted">
        {emptyMessage ?? t('noScreenshots')}
      </p>
    )
  }

  return (
    <motion.ul
      className={cn(
        'grid list-none gap-5 p-0 md:gap-6',
        isExhibition
          ? 'exhibit-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.04,
          },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            layout={!reduceMotion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
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
