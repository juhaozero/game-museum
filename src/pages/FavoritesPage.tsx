import { Link } from 'react-router-dom'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { useAppContext } from '@/hooks/useAppContext'
import { useI18n } from '@/i18n/useI18n'
import { publicUiEnv } from '@/utils/publicEnv'
import { buildShelfUrl } from '@/utils/routes'

export function FavoritesPage() {
  const { manifestState, gallery } = useAppContext()
  const { favoriteScreenshots, stats } = gallery
  const { t } = useI18n()

  if (manifestState.status === 'loading') {
    return (
      <div
        aria-busy="true"
        className="mx-auto max-w-7xl space-y-4"
        aria-label={t('loading')}
      >
        <div className="h-4 w-32 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
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

  const orphanCount = stats.favoriteCount - stats.favoriteVisibleCount

  return (
    <section className="mx-auto max-w-7xl">
      <p className="mb-8 text-sm text-muted">
        <Link
          to={buildShelfUrl(gallery.selectedCategory, gallery.searchQuery)}
          className="text-muted no-underline hover:text-accent"
        >
          {t('backToShelf')}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{t('myFavorites')}</span>
        {stats.favoriteVisibleCount > 0 && (
          <span className="ml-2 font-mono text-xs tabular-nums">
            {t('shotCount', { count: stats.favoriteVisibleCount })}
          </span>
        )}
      </p>

      {favoriteScreenshots.length === 0 ? (
        <div className="text-pretty text-muted">
          <p>{t('favoritesEmpty')}</p>
          <p className="mt-2 text-sm">
            <Link to="/" className="text-accent no-underline hover:underline">
              {t('goToShelf')}
            </Link>
          </p>
          {orphanCount > 0 && (
            <p className="mt-2 text-xs">
              {t('orphanFavorites', { count: orphanCount })}
            </p>
          )}
        </div>
      ) : (
        <ScreenshotGrid
          items={favoriteScreenshots}
          showGameName={publicUiEnv.showScreenshotGameName}
          showFileName={publicUiEnv.showImageFileName}
        />
      )}
    </section>
  )
}
