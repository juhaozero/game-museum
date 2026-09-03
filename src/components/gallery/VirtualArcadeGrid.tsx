import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/utils/cn'

const VIRTUAL_THRESHOLD = 36
/** 每 N 张偶发跨列宽格（仅非虚拟 CSS grid） */
const WIDE_EVERY = 7

function columnCountForWidth(width: number) {
  if (width >= 1536) return 6
  if (width >= 1280) return 5
  if (width >= 1024) return 4
  if (width >= 640) return 3
  return 2
}

/** 预估单行高度：封面 2:3 + gap + 灯带余量 + 微错落 */
function estimateRowHeight(columnWidth: number) {
  return Math.round(columnWidth * 1.5 + 32)
}

function cellRhythmClass(index: number, enableWide: boolean) {
  const wide = enableWide && index > 0 && index % WIDE_EVERY === 3
  const nudge =
    index % 3 === 1
      ? 'arcade-cell--nudge-a'
      : index % 5 === 3
        ? 'arcade-cell--nudge-b'
        : undefined
  return cn(wide && 'arcade-cell--wide', nudge)
}

type VirtualArcadeGridProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  className?: string
  /** 筛选/主题变更时换 key，触发整墙换展出入场 */
  animationKey?: string
}

/**
 * 封面墙网格：少量直出 CSS grid（含偶发宽格）；≥36 用行级虚拟列表（窗口滚动）。
 */
export function VirtualArcadeGrid<T>({
  items,
  getKey,
  renderItem,
  className,
  animationKey = 'default',
}: VirtualArcadeGridProps<T>) {
  const reduceMotion = useReducedMotion()
  const listRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(4)
  const [colWidth, setColWidth] = useState(160)
  const [scrollMargin, setScrollMargin] = useState(0)

  const measure = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const width = el.clientWidth
    const nextCols = columnCountForWidth(window.innerWidth)
    const gap = width >= 1280 ? 14 : width >= 640 ? 12 : 10
    const nextColWidth = Math.max(80, (width - gap * (nextCols - 1)) / nextCols)
    setCols(nextCols)
    setColWidth(nextColWidth)
    setScrollMargin(el.offsetTop)
  }, [])

  useEffect(() => {
    measure()
    const el = listRef.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  const useVirtual = items.length >= VIRTUAL_THRESHOLD
  const rowCount = Math.ceil(items.length / cols) || 0
  const rowHeight = estimateRowHeight(colWidth)

  const virtualizer = useWindowVirtualizer({
    count: useVirtual ? rowCount : 0,
    estimateSize: () => rowHeight,
    overscan: 2,
    scrollMargin,
  })

  useEffect(() => {
    if (!useVirtual) return
    virtualizer.measure()
  }, [useVirtual, rowHeight, scrollMargin, virtualizer])

  if (!useVirtual) {
    const staggerIn = reduceMotion ? 0 : 0.055
    const staggerOut = reduceMotion ? 0 : 0.025
    const enableWide = cols >= 3

    return (
      <div ref={listRef}>
        <AnimatePresence mode="wait">
          <motion.ul
            key={animationKey}
            className={cn('arcade-grid arcade-grid--mason', className)}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: staggerIn },
              },
              exit: {
                transition: {
                  staggerChildren: staggerOut,
                  staggerDirection: -1,
                },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.li
                key={getKey(item)}
                className={cn('relative z-[1]', cellRhythmClass(index, enableWide))}
                variants={{
                  hidden: reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.34, ease: 'easeOut' },
                  },
                  exit: reduceMotion
                    ? { opacity: 0, transition: { duration: 0.12 } }
                    : {
                        opacity: 0,
                        y: 8,
                        transition: { duration: 0.18, ease: 'easeIn' },
                      },
                }}
              >
                {renderItem(item)}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    )
  }

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div ref={listRef}>
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualRows.map((virtualRow) => {
          const start = virtualRow.index * cols
          const rowItems = items.slice(start, start + cols)
          return (
            <ul
              key={`${animationKey}-${virtualRow.key}`}
              data-index={virtualRow.index}
              className={cn('arcade-grid absolute left-0 w-full', className)}
              style={{
                transform: `translateY(${
                  virtualRow.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {rowItems.map((item, colIndex) => {
                const globalIndex = start + colIndex
                return (
                  <motion.li
                    key={getKey(item)}
                    className={cn(
                      'relative z-[1]',
                      cellRhythmClass(globalIndex, false),
                    )}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.28,
                      ease: 'easeOut',
                      delay: reduceMotion ? 0 : Math.min(colIndex * 0.03, 0.12),
                    }}
                  >
                    {renderItem(item)}
                  </motion.li>
                )
              })}
            </ul>
          )
        })}
      </div>
    </div>
  )
}
