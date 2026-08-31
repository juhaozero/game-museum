import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { GameBox } from '@/components/gallery/GameBox'
import { ShelfDock } from '@/components/layout/ShelfDock'
import { ShelfHero } from '@/components/layout/ShelfHero'
import { ShelfSkeleton } from '@/components/ui/ShelfSkeleton'
import { MOCK_SHELF_GAMES } from '@/data/mockShelfGames'
import { useAppContext } from '@/hooks/useAppContext'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useI18n } from '@/i18n/useI18n'

type ShelfItem = {
  id: string
  name: string
  shotCount: number
  coverUrl?: string
  href?: string
}

export function ShelfPage() {
  const { manifestState, gallery } = useAppContext()
  const { filteredGames, isFiltering, stats, categories, selectedCategory } =
    gallery
  const { navigateToCategory, clearFiltersAndNavigate } = useGalleryRouting()
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()

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

  const useMock = gallery.allGames.length === 0
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
  const totalCount = useMock ? MOCK_SHELF_GAMES.length : stats.gameCount
  const shownCount = items.length

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-14">
      <ShelfHero
        gameCount={useMock ? MOCK_SHELF_GAMES.length : stats.gameCount}
        shotCount={useMock ? 0 : stats.shotCount}
        categoryCount={useMock ? 0 : stats.categoryCount}
        gameIds={poolIds}
      />

      <div className="min-w-0">
        {!useMock && isFiltering && filteredGames.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center text-pretty text-muted">
            <p>
              {gallery.debouncedSearch.trim()
                ? t('noMatchSearch', { query: gallery.debouncedSearch })
                : t('noGamesInCategory')}
            </p>
          </div>
        ) : (
          <motion.ul
            className="grid w-full list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.045,
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
                  />
                )

                return (
                  <motion.li
                    key={game.id}
                    layout={!reduceMotion}
                    variants={{
                      hidden: reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.28, ease: 'easeOut' },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                    transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
                  >
                    {game.href ? (
                      <Link
                        to={game.href}
                        className="block no-underline outline-offset-4"
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
        )}

        <ShelfDock
          shown={shownCount}
          total={totalCount}
          categories={categories}
          selectedCategory={selectedCategory}
          isFiltering={isFiltering}
          onSelectCategory={navigateToCategory}
          onClear={clearFiltersAndNavigate}
        />
      </div>
    </div>
  )
}
