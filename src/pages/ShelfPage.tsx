import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { GameBox } from '@/components/gallery/GameBox'
import { ShelfSkeleton } from '@/components/ui/ShelfSkeleton'
import { useAppContext } from '@/hooks/useAppContext'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'

export function ShelfPage() {
  const density = usePreferencesStore((s) => s.density)
  const { manifestState, gallery } = useAppContext()
  const { filteredGames, isFiltering } = gallery
  const reduceMotion = useReducedMotion()

  if (manifestState.status === 'loading') {
    return <ShelfSkeleton density={density} />
  }

  if (manifestState.status === 'error') {
    return (
      <p className="text-pretty text-muted">
        {manifestState.message}。请先运行{' '}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
          npm run manifest
        </code>
      </p>
    )
  }

  if (gallery.allGames.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-pretty text-muted">
        <p>manifest 为空。请整理本地截图并生成清单，详见 docs/manifest.md。</p>
        <pre className="mt-4 overflow-x-auto rounded border border-hairline bg-surface p-4 font-mono text-xs text-fg">
          {`Screenshots/游戏名/001.jpg\nnpm run manifest`}
        </pre>
      </div>
    )
  }

  if (isFiltering && filteredGames.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center text-pretty text-muted">
        <p>
          {gallery.debouncedSearch.trim() ? (
            <>
              没有找到与「
              <span className="text-fg">{gallery.debouncedSearch}</span>
              」匹配的游戏。
            </>
          ) : (
            <>当前分类下没有游戏。</>
          )}
        </p>
      </div>
    )
  }

  return (
    <section>
      <motion.ul
        className={cn(
          'mx-auto grid max-w-7xl list-none gap-7 p-0 md:gap-9 lg:gap-10',
          density === 2 && 'grid-cols-1 sm:grid-cols-2',
          density === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          density === 4 && 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
        )}
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
          {filteredGames.map((game) => {
            const favCover = gallery.favoriteScreenshots.find(
              (s) => s.gameId === game.id,
            )?.url
            const coverUrl = favCover ?? game.coverUrl

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
                <Link
                  to={`/game/${game.id}`}
                  className="block no-underline outline-offset-4"
                >
                  <GameBox
                    gameId={game.id}
                    title={game.name}
                    shotCount={game.shotCount}
                    coverUrl={coverUrl || undefined}
                  />
                </Link>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
