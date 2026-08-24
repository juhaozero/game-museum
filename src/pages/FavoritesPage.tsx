import { Link } from 'react-router-dom'
import { ScreenshotGrid } from '@/components/gallery/ScreenshotGrid'
import { useAppContext } from '@/hooks/useAppContext'
import { buildShelfUrl } from '@/utils/routes'

export function FavoritesPage() {
  const { manifestState, gallery } = useAppContext()
  const { favoriteScreenshots, stats } = gallery

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

  const orphanCount = stats.favoriteCount - stats.favoriteVisibleCount

  return (
    <section className="mx-auto max-w-7xl">
      <p className="mb-8 text-sm text-muted">
        <Link
          to={buildShelfUrl(gallery.selectedCategory, gallery.searchQuery)}
          className="text-muted no-underline hover:text-accent"
        >
          ← 馆藏
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg">我的收藏</span>
        {stats.favoriteVisibleCount > 0 && (
          <span className="ml-2 font-mono text-xs">
            {stats.favoriteVisibleCount} 张
          </span>
        )}
      </p>

      {favoriteScreenshots.length === 0 ? (
        <div className="text-muted">
          <p>星标过的截图会出现在这里。</p>
          {orphanCount > 0 && (
            <p className="mt-2 text-xs">
              有 {orphanCount} 条收藏已不在当前 manifest 中。
            </p>
          )}
        </div>
      ) : (
        <ScreenshotGrid items={favoriteScreenshots} />
      )}
    </section>
  )
}
