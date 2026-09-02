import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useLocation } from 'react-router-dom'
import { FavoriteStar } from '@/components/ui/FavoriteStar'
import { useI18n } from '@/i18n/useI18n'
import { useGalleryStore } from '@/store/useGalleryStore'
import { useLightboxStore } from '@/store/useLightboxStore'
import { publicUiEnv } from '@/utils/publicEnv'

/** Level 3 · Lightbox：共享元素放大、键盘切换、侧栏/底部展签 */
export function Lightbox() {
  const isOpen = useLightboxStore((s) => s.isOpen)
  const items = useLightboxStore((s) => s.items)
  const index = useLightboxStore((s) => s.index)
  const close = useLightboxStore((s) => s.close)
  const next = useLightboxStore((s) => s.next)
  const prev = useLightboxStore((s) => s.prev)
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()
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
          className="lightbox-overlay fixed inset-0 z-lightbox flex h-dvh flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.2 }}
          onClick={close}
        >
          <div className="lightbox-vignette" aria-hidden />
          <div className="lightbox-spotlight" aria-hidden />

          <div
            className="lightbox-toolbar relative z-[1] flex items-center justify-between gap-3 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={titleId} className="min-w-0 truncate text-sm">
              <span className="type-label text-accent">
                {t('lightboxExhibit')}
              </span>
              <span className="lightbox-toolbar-sep mx-2">·</span>
              <span className="text-[var(--lightbox-fg)]">{item.gameName}</span>
              <span className="lightbox-toolbar-sep mx-2">·</span>
              <span className="lightbox-toolbar-count type-label tabular-nums">
                {index + 1} / {items.length}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <FavoriteStar
                active={isFavorite}
                onToggle={() => toggleFavorite(item.id)}
                visibility="always"
                className="bg-[var(--lightbox-control-bg)] text-star"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t('close')}
                className="lightbox-close rounded px-2.5 py-1.5 text-sm"
              >
                {t('close')}
              </button>
            </div>
          </div>

          <div
            className="relative z-[1] flex min-h-0 flex-1 flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center px-2 md:px-6">
              <button
                type="button"
                onClick={prev}
                aria-label={t('prevShot')}
                className="lightbox-nav-btn absolute left-2 z-10 hidden md:block"
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
                    className="lightbox-frame exhibit-frame max-h-full max-w-full overflow-hidden"
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
                          className="max-h-[calc(100dvh-11rem)] max-w-full object-contain lg:max-h-[calc(100dvh-8rem)]"
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
                aria-label={t('nextShot')}
                className="lightbox-nav-btn absolute right-2 z-10 hidden md:block"
              >
                ›
              </button>
            </div>

            <motion.aside
              className="lightbox-plaque lightbox-plaque--rail"
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
              <PlaqueBody
                gameName={item.gameName}
                category={item.category}
                fileName={item.fileName}
                hints
              />
            </motion.aside>
          </div>

          <div
            className="relative z-[1] lg:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-nav-mobile md:hidden">
              <button
                type="button"
                onClick={prev}
                aria-label={t('prevShot')}
                className="lightbox-nav-btn"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t('nextShot')}
                className="lightbox-nav-btn"
              >
                ›
              </button>
            </div>
            <aside className="lightbox-plaque lightbox-plaque--dock">
              <div className="lightbox-dock-row">
                <p className="type-label text-accent">{t('lightboxExhibit')}</p>
                <p className="type-label tabular-nums text-[var(--lightbox-dim)]">
                  {index + 1} / {items.length}
                </p>
              </div>
              <p className="lightbox-plaque-value mt-1 truncate text-sm">
                {item.gameName}
              </p>
              <div className="lightbox-dock-meta">
                <span>{item.category}</span>
                {publicUiEnv.showImageFileName && (
                  <span className="truncate">{item.fileName}</span>
                )}
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PlaqueBody({
  gameName,
  category,
  fileName,
  hints = false,
}: {
  gameName: string
  category: string
  fileName: string
  hints?: boolean
}) {
  const { t } = useI18n()

  return (
    <>
      <p className="type-label text-accent">{t('lightboxExhibit')}</p>
      <p className="lightbox-plaque-label mt-4 text-xs">{t('game')}</p>
      <p className="lightbox-plaque-value mt-1 text-pretty">{gameName}</p>
      <p className="lightbox-plaque-label mt-4 text-xs">{t('category')}</p>
      <p className="lightbox-plaque-value mt-1 opacity-90">{category}</p>
      {publicUiEnv.showImageFileName && (
        <>
          <p className="lightbox-plaque-label mt-4 text-xs">{t('file')}</p>
          <p className="lightbox-plaque-file type-label mt-1 break-all">
            {fileName}
          </p>
        </>
      )}
      {hints && (
        <p className="lightbox-plaque-hint mt-6 text-xs">{t('lightboxHints')}</p>
      )}
    </>
  )
}
