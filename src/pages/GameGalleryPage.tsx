import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useAppContext } from '@/hooks/useAppContext'
import { useI18n } from '@/i18n/useI18n'
import { publicUiEnv } from '@/utils/publicEnv'
import { buildShelfUrl } from '@/utils/routes'

export function GameGalleryPage() {
  const { gameId } = useParams()
  const { manifestState, gallery } = useAppContext()
  const { t } = useI18n()

  if (manifestState.status === 'loading') {
    return (
      <div
        aria-busy="true"
        aria-label={t('loading')}
        className="exhibit-page mx-auto max-w-6xl space-y-6"
      >
        <div className="h-4 w-40 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded bg-surface"
            />
          ))}
        </div>
      </div>
    )
  }

  if (manifestState.status === 'error') {
    return (
      <p className="text-pretty text-muted">
        {manifestState.message}. {t('runManifestHint')}{' '}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
          npm run manifest
        </code>
      </p>
    )
  }

  const game = gallery.getGameById(gameId)
  const shots = gameId ? gallery.getScreenshotsByGameId(gameId) : []
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
        <p className="text-pretty text-muted">{t('gameNotFound')}</p>
      </section>
    )
  }

  return (
    <section className="exhibit-page mx-auto max-w-6xl">
      <header className="exhibit-header mb-8 md:mb-10">
        <Link
          to={backUrl}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted no-underline transition-colors hover:text-accent"
        >
          {t('backToShelf')}
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {coverUrl && (
            <motion.div
              layoutId={`cover-${game.id}`}
              className="exhibit-entry-cover cinema-screen shrink-0 overflow-hidden"
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

          <div className="min-w-0 flex-1">
            <p className="type-label mb-2 inline-flex items-center gap-2 text-accent">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--shelf-glow)]"
              />
              {t('exhibitWall')}
            </p>
            <h1 className="type-display text-balance text-2xl text-fg sm:text-3xl">
              {game.name}
            </h1>
            <p className="type-label mt-2 tabular-nums text-muted">
              {game.category} · {t('shotsLabel', { count: game.shotCount })}
            </p>
          </div>
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
