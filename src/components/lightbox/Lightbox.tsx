import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useLocation } from 'react-router-dom'
import { FavoriteStar } from '@/components/ui/FavoriteStar'
import { useGalleryStore } from '@/store/useGalleryStore'
import { useLightboxStore } from '@/store/useLightboxStore'
import { publicUiEnv } from '@/utils/publicEnv'

/** Level 3 · Lightbox：共享元素放大、键盘切换、右侧信息面板 */
export function Lightbox() {
  const isOpen = useLightboxStore((s) => s.isOpen)
  const items = useLightboxStore((s) => s.items)
  const index = useLightboxStore((s) => s.index)
  const close = useLightboxStore((s) => s.close)
  const next = useLightboxStore((s) => s.next)
  const prev = useLightboxStore((s) => s.prev)
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const routeKey = `${location.pathname}${location.search}`
  const prevRouteKeyRef = useRef(routeKey)

  const item = items[index]
  const isFavorite = useGalleryStore((s) =>
    item ? s.isFavorite(item.id) : false,
  )
  const toggleFavorite = useGalleryStore((s) => s.toggleFavorite)

  // 路由切换时关闭，避免遮罩/滚动锁残留
  useEffect(() => {
    if (prevRouteKeyRef.current === routeKey) return
    prevRouteKeyRef.current = routeKey
    close()
  }, [routeKey, close])

  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close, next, prev])

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-lightbox flex h-dvh flex-col bg-black/80 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.2 }}
          onClick={close}
        >
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={titleId} className="min-w-0 truncate text-sm">
              {item.gameName}
              <span className="mx-2 text-white/40">·</span>
              <span className="font-mono text-xs tabular-nums text-white/50">
                {index + 1} / {items.length}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <FavoriteStar
                active={isFavorite}
                onToggle={() => toggleFavorite(item.id)}
                visibility="always"
                className="bg-white/10 text-star"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="关闭"
                className="rounded px-2.5 py-1.5 text-sm text-white/70 hover:text-white"
              >
                关闭
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-w-0 flex-1 items-center justify-center px-2 md:px-6">
              <button
                type="button"
                onClick={prev}
                aria-label="上一张"
                className="absolute left-2 z-10 hidden rounded bg-black/40 px-2 py-3 text-white/80 hover:text-white md:block"
              >
                ‹
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  className="flex h-full max-h-full w-full max-w-5xl items-center justify-center"
                  initial={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }
                  }
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <motion.div
                    layoutId={`shot-${item.id}`}
                    className="max-h-full max-w-full"
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={4}
                      doubleClick={{ mode: 'toggle' }}
                    >
                      <TransformComponent
                        wrapperClass="!h-full !w-full"
                        contentClass="!flex !h-full !w-full !items-center !justify-center"
                      >
                        <img
                          src={item.url}
                          alt={item.fileName}
                          className="max-h-[calc(100dvh-8rem)] max-w-full object-contain"
                          draggable={false}
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={next}
                aria-label="下一张"
                className="absolute right-2 z-10 hidden rounded bg-black/40 px-2 py-3 text-white/80 hover:text-white md:block"
              >
                ›
              </button>
            </div>

            <motion.aside
              className="hidden w-64 shrink-0 border-l border-white/10 bg-black/40 p-5 text-sm text-white/80 lg:block"
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.24,
                delay: reduceMotion ? 0 : 0.06,
                ease: 'easeOut',
              }}
            >
              <p className="text-xs text-white/45">游戏</p>
              <p className="mt-1 text-pretty text-white">{item.gameName}</p>
              <p className="mt-4 text-xs text-white/45">分类</p>
              <p className="mt-1 text-white/90">{item.category}</p>
              {publicUiEnv.showImageFileName && (
                <>
                  <p className="mt-4 text-xs text-white/45">文件</p>
                  <p className="mt-1 break-all font-mono text-xs text-white/70">
                    {item.fileName}
                  </p>
                </>
              )}
              <p className="mt-6 text-xs text-white/40">
                ← → 切换 · Esc 关闭 · 滚轮缩放
              </p>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
