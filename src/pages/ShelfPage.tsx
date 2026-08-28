import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { GameBox } from '@/components/gallery/GameBox'
import { ShelfSkeleton } from '@/components/ui/ShelfSkeleton'
import { MOCK_SHELF_GAMES } from '@/data/mockShelfGames'
import { useAppContext } from '@/hooks/useAppContext'
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
  const { filteredGames, isFiltering } = gallery
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

  // 无 manifest 时用 mock 展示 Level 1 盒墙骨架
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

  if (!useMock && isFiltering && filteredGames.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center text-pretty text-muted">
        <p>
          {gallery.debouncedSearch.trim()
            ? t('noMatchSearch', { query: gallery.debouncedSearch })
            : t('noGamesInCategory')}
        </p>
      </div>
    )
  }

  return (
    <section>
      <motion.ul
        className="mx-auto grid max-w-7xl list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduceMotion ? 0 : 0.05,
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
                    : { opacity: 0, y: 12 },
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
    </section>
  )
}
