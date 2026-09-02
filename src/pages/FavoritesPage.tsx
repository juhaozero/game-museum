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
  const backUrl = buildShelfUrl(gallery.selectedCategory, gallery.searchQuery)

  if (manifestState.status === 'loading') {
    return (
      <div
        aria-busy="true"
        className="exhibit-page mx-auto max-w-6xl space-y-6"
        aria-label={t('loading')}
      >
        <div className="h-4 w-40 animate-pulse rounded bg-surface" />
        <div className="exhibit-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`aspect-video animate-pulse rounded-md border border-[color:var(--cabinet-edge)] bg-surface ${
                i === 0 ? 'exhibit-lead' : ''
              }`}
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

  const orphanCount = stats.favoriteCount - stats.favoriteVisibleCount

  return (
    <section className="exhibit-page exhibit-page--highlights mx-auto max-w-6xl">
      <header className="exhibit-header mb-8 md:mb-10">
        <Link
          to={backUrl}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted no-underline transition-colors hover:text-accent"
        >
          {t('backToShelf')}
        </Link>

        <p className="type-label mb-2 inline-flex items-center gap-2 text-accent">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-[1px] bg-accent shadow-[0_0_10px_var(--shelf-glow)]"
          />
          {t('navFavorites')}
        </p>
        <h1 className="type-display text-balance text-2xl text-fg sm:text-3xl">
          {t('myFavorites')}
        </h1>
        {stats.favoriteVisibleCount > 0 && (
          <p className="type-label mt-2 tabular-nums text-muted">
            {t('shotCount', { count: stats.favoriteVisibleCount })}
          </p>
        )}
      </header>

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
          variant="exhibition"
        />
      )}
    </section>
  )
}
