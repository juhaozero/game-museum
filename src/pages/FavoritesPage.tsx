import { Link } from 'react-router-dom'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { ExhibitEmptyState } from '@/components/ui/ExhibitEmptyState'
import { ExhibitSkeleton } from '@/components/ui/ExhibitSkeleton'
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
    return <ExhibitSkeleton count={4} />
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

        <h1 className="type-hero text-balance text-2xl text-fg sm:text-3xl">
          {t('myFavorites')}
        </h1>
        {stats.favoriteVisibleCount > 0 && (
          <p className="type-label mt-2 tabular-nums text-muted">
            {t('shotCount', { count: stats.favoriteVisibleCount })}
          </p>
        )}
      </header>

      {favoriteScreenshots.length === 0 ? (
        <ExhibitEmptyState
          eyebrow={t('emptyEyebrowFavorites')}
          title={t('favoritesEmpty')}
          body={
            orphanCount > 0
              ? t('orphanFavorites', { count: orphanCount })
              : undefined
          }
          action={{ to: '/', label: t('goToShelf') }}
        />
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
