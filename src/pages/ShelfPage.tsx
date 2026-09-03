import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FeaturedFilmstrip } from '@/components/gallery/FeaturedFilmstrip'
import { GameBox } from '@/components/gallery/GameBox'
import { VirtualArcadeGrid } from '@/components/gallery/VirtualArcadeGrid'
import { ShelfHero } from '@/components/layout/ShelfHero'
import { WallHeader } from '@/components/layout/WallHeader'
import { ExhibitEmptyState } from '@/components/ui/ExhibitEmptyState'
import { ShelfSkeleton } from '@/components/ui/ShelfSkeleton'
import { MOCK_SHELF_GAMES } from '@/data/mockShelfGames'
import { useAppContext } from '@/hooks/useAppContext'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useI18n } from '@/i18n/useI18n'
import { resolveFeaturedExhibits } from '@/utils/featuredShots'
import { cn } from '@/utils/cn'
import { displayGameName } from '@/utils/localized'

type ShelfItem = {
  id: string
  name: string
  shotCount: number
  coverUrl?: string
  href?: string
}

export function ShelfPage() {
  const { manifestState, gallery } = useAppContext()
  const { filteredGames, isFiltering, stats, allGames, categories, selectedCategory } =
    gallery
  const { navigateToCategory, clearFiltersAndNavigate } = useGalleryRouting()
  const { t, locale } = useI18n()

  const manifestItems =
    manifestState.status === 'ready' ? manifestState.data.items : []
  const manifest =
    manifestState.status === 'ready' ? manifestState.data : null
  const useMock =
    manifestState.status === 'ready' && gallery.allGames.length === 0

  const featuredExhibits = useMemo(
    () => (useMock ? null : resolveFeaturedExhibits(manifest)),
    [useMock, manifest],
  )
  const allShots = useMemo(
    () => (useMock ? [] : manifestItems.filter((item) => !item.isCover)),
    [useMock, manifestItems],
  )

  const hasFeatured =
    !!featuredExhibits?.enabled && featuredExhibits.items.length > 0

  if (manifestState.status === 'loading') {
    return <ShelfSkeleton />
  }

  if (manifestState.status === 'error') {
    return (
      <ExhibitEmptyState
        className="mt-10"
        eyebrow={t('emptyEyebrowError')}
        title={manifestState.message}
        body={
          <>
            {t('runManifestHint')}{' '}
            <code className="rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] px-1.5 py-0.5 font-mono text-xs text-accent">
              npm run manifest
            </code>
          </>
        }
        codeHint="npm run manifest"
      />
    )
  }

  const items: ShelfItem[] = useMock
    ? MOCK_SHELF_GAMES.map((g) => ({ ...g }))
    : filteredGames.map((game) => {
        return {
          id: game.id,
          name: displayGameName(game.name, game.title, locale),
          shotCount: game.shotCount,
          coverUrl: game.coverUrl || undefined,
          href: `/game/${game.id}`,
        }
      })

  const poolIds = (useMock ? MOCK_SHELF_GAMES : filteredGames).map((g) => g.id)

  return (
    <div className="mx-auto w-full max-w-[96rem]">
      {hasFeatured && (
        <FeaturedFilmstrip
          items={featuredExhibits.items}
          lightboxPool={allShots.length > 0 ? allShots : manifestItems}
          title={featuredExhibits.labels?.title}
          hint={featuredExhibits.labels?.hint}
          variant="wide"
          className="filmstrip--compact mb-4 lg:mb-5"
        />
      )}

      <div
        className={cn(
          'arcade-stage grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(22rem,0.4fr)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(24rem,0.38fr)_minmax(0,1fr)] xl:gap-14',
          hasFeatured && 'arcade-stage--with-featured',
        )}
      >
        <ShelfHero
          gameCount={useMock ? MOCK_SHELF_GAMES.length : stats.gameCount}
          shotCount={useMock ? 0 : stats.shotCount}
          categoryCount={useMock ? 0 : stats.categoryCount}
          gameIds={poolIds}
          compact={hasFeatured}
        />

        <div className="arcade-viewport">
          {!useMock && (
            <WallHeader
              categories={categories}
              selectedCategory={selectedCategory}
              shown={filteredGames.length}
              total={allGames.length}
              isFiltering={isFiltering}
              onSelectCategory={navigateToCategory}
              onClear={clearFiltersAndNavigate}
            />
          )}

          {!useMock && isFiltering && filteredGames.length === 0 ? (
            <ExhibitEmptyState
              className="mt-2"
              eyebrow={t('emptyEyebrowShelf')}
              title={
                gallery.debouncedSearch.trim()
                  ? t('noMatchSearch', { query: gallery.debouncedSearch })
                  : t('noGamesInCategory')
              }
              body={t('emptyShelfHint')}
              action={
                isFiltering
                  ? {
                      onClick: clearFiltersAndNavigate,
                      label: t('clearFilters'),
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="arcade-wall">
                <VirtualArcadeGrid
                  items={items}
                  animationKey={`${selectedCategory ?? 'all'}|${gallery.debouncedSearch}`}
                  getKey={(game) => game.id}
                  renderItem={(game) => {
                    const box = (
                      <GameBox
                        gameId={game.id}
                        title={game.name}
                        coverUrl={game.coverUrl}
                        sharedTransition={!useMock}
                        cart
                      />
                    )
                    return game.href ? (
                      <Link
                        to={game.href}
                        aria-label={game.name}
                        className="relative z-[1] block no-underline outline-offset-4"
                      >
                        {box}
                      </Link>
                    ) : (
                      box
                    )
                  }}
                />
              </div>
              <div className="arcade-floor" aria-hidden />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
