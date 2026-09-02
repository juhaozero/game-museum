import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/utils/cn'

const VIRTUAL_THRESHOLD = 36

function columnCountForWidth(width: number) {
  if (width >= 1536) return 6
  if (width >= 1280) return 5
  if (width >= 1024) return 4
  if (width >= 640) return 3
  return 2
}

/** 预估单行高度：封面 2:3 + gap + 灯带余量 */
function estimateRowHeight(columnWidth: number) {
  return Math.round(columnWidth * 1.5 + 22)
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
 * 封面墙网格：少量直出 CSS grid；≥36 用行级虚拟列表（窗口滚动）。
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

    return (
      <div ref={listRef}>
        <AnimatePresence mode="wait">
          <motion.ul
            key={animationKey}
            className={cn('arcade-grid', className)}
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
            {items.map((item) => (
              <motion.li
                key={getKey(item)}
                className="relative z-[1]"
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
              {rowItems.map((item) => (
                <li key={getKey(item)} className="relative z-[1]">
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          )
        })}
      </div>
    </div>
  )
}
