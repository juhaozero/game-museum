import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Lightbox } from '@/components/lightbox'
import { useGalleryFilters } from '@/hooks/useGalleryFilters'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useManifest } from '@/hooks/useManifest'
import { useScrollToTop } from '@/hooks/useScrollToTop'

/** Arcade Archive · 柜体壳：顶栏 + 主内容 */
export function AppShell() {
  const manifestState = useManifest()
  const items = manifestState.status === 'ready' ? manifestState.data.items : []
  const gallery = useGalleryFilters(items)
  const { clearFiltersAndNavigate } = useGalleryRouting()

  useScrollToTop()

  return (
    <div className="relative flex min-h-full flex-col text-fg transition-colors duration-200">
      <TopBar
        filteredCount={gallery.stats.filteredGameCount}
        isFiltering={gallery.isFiltering}
        onClearFilters={clearFiltersAndNavigate}
      />
      <main className="relative z-content flex-1 overflow-x-clip px-3 pb-12 pt-4 sm:px-5 md:px-6 md:pt-6 lg:px-8 xl:px-10">
        <Outlet context={{ manifestState, gallery }} />
      </main>
      <Lightbox />
    </div>
  )
}
