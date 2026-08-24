import { Link } from 'react-router-dom'
import { GameBox } from '@/components/gallery/GameBox'
import { useAppContext } from '@/hooks/useAppContext'
import { usePreferencesStore } from '@/store/usePreferencesStore'
import { cn } from '@/utils/cn'

export function ShelfPage() {
  const density = usePreferencesStore((s) => s.density)
  const { manifestState, gallery } = useAppContext()
  const { filteredGames, isFiltering } = gallery

  if (manifestState.status === 'loading') {
    return <p className="text-muted">加载 manifest…</p>
  }

  if (manifestState.status === 'error') {
    return (
      <p className="text-muted">
        {manifestState.message}。请先运行{' '}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
          npm run manifest
        </code>
      </p>
    )
  }

  if (gallery.allGames.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-muted">
        <p>manifest 为空。请整理本地截图并生成清单，详见 docs/manifest.md。</p>
        <pre className="mt-4 overflow-x-auto rounded border border-hairline bg-surface p-4 font-mono text-xs text-fg">
          {`Screenshots/游戏名/001.jpg\nnpm run manifest`}
        </pre>
      </div>
    )
  }

  if (isFiltering && filteredGames.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center text-muted">
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
      <ul
        className={cn(
          'mx-auto grid max-w-7xl list-none gap-8 p-0 md:gap-10',
          density === 2 && 'grid-cols-1 sm:grid-cols-2',
          density === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          density === 4 && 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {filteredGames.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} className="block no-underline">
              <GameBox
                title={game.name}
                shotCount={game.shotCount}
                coverUrl={game.coverUrl}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
