import { Link, useParams } from 'react-router-dom'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { useAppContext } from '@/hooks/useAppContext'
import { buildShelfUrl } from '@/utils/routes'

export function GameGalleryPage() {
  const { gameId } = useParams()
  const { manifestState, gallery } = useAppContext()

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

  const game = gallery.getGameById(gameId)
  const shots = gameId ? gallery.getScreenshotsByGameId(gameId) : []
  const backUrl = buildShelfUrl(gallery.selectedCategory, gallery.searchQuery)

  if (!game) {
    return (
      <section className="mx-auto max-w-7xl">
        <p className="mb-8 text-sm text-muted">
          <Link to={backUrl} className="text-muted no-underline hover:text-accent">
            ← 馆藏
          </Link>
        </p>
        <p className="text-muted">未找到该游戏。</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl">
      <p className="mb-2 text-sm text-muted">
        <Link to={backUrl} className="text-muted no-underline hover:text-accent">
          ← 馆藏
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{game.name}</span>
      </p>
      <p className="mb-8 font-mono text-xs text-muted">
        {game.category} · {game.shotCount} shots
      </p>

      <ScreenshotGrid items={shots} showGameName={false} emptyMessage="该游戏暂无截图" />

      <p className="mt-8 text-xs text-muted">
        虚拟列表与 Lightbox 将在后续阶段接入。
      </p>
    </section>
  )
}
