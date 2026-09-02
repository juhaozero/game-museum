import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { ExhibitEmptyState } from '@/components/ui/ExhibitEmptyState'
import { ExhibitSkeleton } from '@/components/ui/ExhibitSkeleton'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useAppContext } from '@/hooks/useAppContext'
import { useI18n } from '@/i18n/useI18n'
import { publicUiEnv } from '@/utils/publicEnv'
import { buildShelfUrl } from '@/utils/routes'

export function GameGalleryPage() {
  const { gameId } = useParams()
  const { manifestState, gallery } = useAppContext()
  const { t } = useI18n()
  const reduceMotion = useReducedMotion()

  if (manifestState.status === 'loading') {
    return <ExhibitSkeleton />
  }

  if (manifestState.status === 'error') {
    return (
      <ExhibitEmptyState
        className="mt-10"
        eyebrow={t('emptyEyebrowError')}
        title={manifestState.message}
        body={t('runManifestHint')}
        codeHint="npm run manifest"
      />
    )
  }

  const game = gallery.getGameById(gameId)
  const shots = gameId
    ? gallery.getScreenshotsByGameId(gameId).filter((item) => !item.isCover)
    : []
  const backUrl = buildShelfUrl(gallery.selectedCategory, gallery.searchQuery)
  const favCover = game
    ? gallery.favoriteScreenshots.find((s) => s.gameId === game.id)?.url
    : undefined
  const coverUrl = favCover ?? game?.coverUrl

  if (!game) {
    return (
      <section className="exhibit-page mx-auto max-w-6xl">
        <p className="mb-8 text-sm text-muted">
          <Link
            to={backUrl}
            className="text-muted no-underline hover:text-accent"
          >
            {t('backToShelf')}
          </Link>
        </p>
        <ExhibitEmptyState
          eyebrow={t('emptyEyebrowShelf')}
          title={t('gameNotFound')}
          action={{ to: backUrl, label: t('goToShelf') }}
        />
      </section>
    )
  }

  const plaqueItem = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.34, ease: 'easeOut' as const },
    },
  }

  return (
    <section className="exhibit-page mx-auto max-w-6xl">
      <header className="exhibit-header mb-8 md:mb-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <Link
            to={backUrl}
            className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted no-underline transition-colors hover:text-accent"
          >
            {t('backToShelf')}
          </Link>
        </motion.div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {coverUrl && (
            <motion.div
              layoutId={`cover-${game.id}`}
              className="exhibit-entry-cover cart-cover shrink-0 overflow-hidden"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="aspect-[2/3] w-[120px] sm:w-[140px]">
                <ImageWithState
                  src={coverUrl}
                  alt=""
                  fallbackGlyph={game.name.slice(0, 1)}
                />
              </div>
            </motion.div>
          )}

          <motion.div
            className="min-w-0 flex-1"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.09,
                  delayChildren: reduceMotion ? 0 : 0.14,
                },
              },
            }}
          >
            <motion.p
              className="type-label mb-2 inline-flex items-center gap-2 text-accent"
              variants={plaqueItem}
            >
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-[1px] bg-accent shadow-[0_0_10px_var(--shelf-glow)]"
              />
              {t('exhibitWall')}
            </motion.p>
            <motion.h1
              className="type-hero text-balance text-2xl text-fg sm:text-3xl"
              variants={plaqueItem}
            >
              {game.name}
            </motion.h1>
            <motion.p
              className="type-label mt-2 tabular-nums text-muted"
              variants={plaqueItem}
            >
              {game.category}
              {shots.length > 0 && (
                <> · {t('shotsLabel', { count: shots.length })}</>
              )}
            </motion.p>
          </motion.div>
        </div>
      </header>

      <ScreenshotGrid
        items={shots}
        showGameName={false}
        showFileName={publicUiEnv.showImageFileName}
        emptyMessage={t('noScreenshotsForGame')}
        variant="exhibition"
      />
    </section>
  )
}
