import { Outlet } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { Lightbox } from '@/components/lightbox'
import { useGalleryFilters } from '@/hooks/useGalleryFilters'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useManifest } from '@/hooks/useManifest'
import { useScrollToTop } from '@/hooks/useScrollToTop'

/** 影院货架壳：浮层顶栏 + 主内容（Hero/封面墙在 ShelfPage） */
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
      <main className="relative z-content flex-1 px-4 pb-8 pt-6 sm:px-6 md:px-8 md:pt-8 lg:px-10">
        <Outlet context={{ manifestState, gallery }} />
      </main>
      <Lightbox />
    </div>
  )
}
