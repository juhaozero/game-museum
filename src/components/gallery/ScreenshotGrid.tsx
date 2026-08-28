import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ScreenshotItem } from '@/types/manifest'
import { ScreenshotCard } from '@/components/gallery/ScreenshotCard'
import { cn } from '@/utils/cn'

type ScreenshotGridProps = {
  items: ScreenshotItem[]
  showGameName?: boolean
  showFileName?: boolean
  className?: string
  emptyMessage?: string
}

/** 疏朗截图网格（滚动 reveal 在卡片内 whileInView） */
export function ScreenshotGrid({
  items,
  showGameName = true,
  showFileName = true,
  className,
  emptyMessage = '暂无截图',
}: ScreenshotGridProps) {
  const reduceMotion = useReducedMotion()

  if (items.length === 0) {
    return <p className="text-pretty text-muted">{emptyMessage}</p>
  }

  return (
    <motion.ul
      className={cn(
        'grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4',
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
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
