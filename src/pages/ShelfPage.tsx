import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FeaturedFilmstrip } from '@/components/gallery/FeaturedFilmstrip'
import { GameBox } from '@/components/gallery/GameBox'
import { ShelfDock } from '@/components/layout/ShelfDock'
import { ShelfHero } from '@/components/layout/ShelfHero'
import { ShelfSkeleton } from '@/components/ui/ShelfSkeleton'
import { MOCK_SHELF_GAMES } from '@/data/mockShelfGames'
import { useAppContext } from '@/hooks/useAppContext'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useI18n } from '@/i18n/useI18n'
import { resolveFeaturedExhibits } from '@/utils/featuredShots'

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
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()

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

  if (manifestState.status === 'loading') {
    return <ShelfSkeleton />
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

  const items: ShelfItem[] = useMock
    ? MOCK_SHELF_GAMES.map((g) => ({ ...g }))
    : filteredGames.map((game) => {
        const favCover = gallery.favoriteScreenshots.find(
          (s) => s.gameId === game.id,
        )?.url
        return {
          id: game.id,
          name: game.name,
          shotCount: game.shotCount,
          coverUrl: (favCover ?? game.coverUrl) || undefined,
          href: `/game/${game.id}`,
        }
      })

  const poolIds = (useMock ? MOCK_SHELF_GAMES : filteredGames).map((g) => g.id)

  return (
    <>
      {featuredExhibits?.enabled && featuredExhibits.items.length > 0 && (
        <FeaturedFilmstrip
          items={featuredExhibits.items}
          lightboxPool={allShots.length > 0 ? allShots : manifestItems}
          title={featuredExhibits.labels?.title}
          hint={featuredExhibits.labels?.hint}
          variant="wide"
          className="mb-6 lg:mb-8"
        />
      )}

      <div className="arcade-stage grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(200px,260px)_minmax(0,1fr)] lg:gap-6 xl:gap-10">
        <ShelfHero
          gameCount={useMock ? MOCK_SHELF_GAMES.length : stats.gameCount}
          shotCount={useMock ? 0 : stats.shotCount}
          categoryCount={useMock ? 0 : stats.categoryCount}
          gameIds={poolIds}
        />

        <div className="arcade-viewport">
        {!useMock && isFiltering && filteredGames.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center text-pretty text-muted">
            <p>
              {gallery.debouncedSearch.trim()
                ? t('noMatchSearch', { query: gallery.debouncedSearch })
                : t('noGamesInCategory')}
            </p>
          </div>
        ) : (
          <>
            {!useMock && (
              <p className="type-label mb-4 inline-flex items-center gap-2 text-accent">
                <span
                  aria-hidden
                  className="inline-block size-1.5 rounded-[1px] bg-accent"
                />
                {t('exhibitWall')}
              </p>
            )}
            <div className="arcade-wall">
              <motion.ul
                className="arcade-grid"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.035,
                    },
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {items.map((game) => {
                    const box = (
                      <GameBox
                        gameId={game.id}
                        title={game.name}
                        shotCount={game.shotCount}
                        coverUrl={game.coverUrl}
                        sharedTransition={!useMock}
                        cart
                      />
                    )

                    return (
                      <motion.li
                        key={game.id}
                        layout={!reduceMotion}
                        className="relative z-[1]"
                        variants={{
                          hidden: reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 18 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.34, ease: 'easeOut' },
                          },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.15 },
                        }}
                        transition={{
                          layout: { duration: 0.3, ease: 'easeOut' },
                        }}
                      >
                        {game.href ? (
                          <Link
                            to={game.href}
                            className="relative z-[1] block no-underline outline-offset-4"
                          >
                            {box}
                          </Link>
                        ) : (
                          box
                        )}
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
            <div className="arcade-floor" aria-hidden />
          </>
        )}
      </div>
      </div>

      {!useMock && (
        <ShelfDock
          shown={filteredGames.length}
          total={allGames.length}
          categories={categories}
          selectedCategory={selectedCategory}
          isFiltering={isFiltering}
          onSelectCategory={navigateToCategory}
          onClear={clearFiltersAndNavigate}
        />
      )}
    </>
  )
}
