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
        className="mx-auto max-w-7xl space-y-6"
      >
        <div className="h-4 w-40 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded bg-surface" />
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
      <section className="mx-auto max-w-7xl">
        <p className="mb-8 text-sm text-muted">
          <Link to={backUrl} className="text-muted no-underline hover:text-accent">
            {t('backToShelf')}
          </Link>
        </p>
        <p className="text-pretty text-muted">{t('gameNotFound')}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl">
      <p className="mb-6 text-sm text-muted">
        <Link to={backUrl} className="text-muted no-underline hover:text-accent">
          {t('backToShelf')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{game.name}</span>
      </p>

      {coverUrl && (
        <motion.div
          layoutId={`cover-${game.id}`}
          className="mb-8 max-w-md overflow-hidden rounded border border-hairline"
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <div className="aspect-video">
            <ImageWithState
              src={coverUrl}
              alt=""
              fallbackGlyph={game.name.slice(0, 1)}
            />
          </div>
        </motion.div>
      )}

      <p className="mb-6 font-mono text-xs tabular-nums text-muted">
        {game.category} · {t('shotsLabel', { count: game.shotCount })}
      </p>

      <ScreenshotGrid
        items={shots}
        showGameName={false}
        showFileName={publicUiEnv.showImageFileName}
        emptyMessage={t('noScreenshotsForGame')}
      />
    </section>
  )
}
