import { Outlet, useLocation } from 'react-router-dom'
import { CategoryChips } from '@/components/layout/CategoryChips'
import { TopBar } from '@/components/layout/TopBar'
import { MotifBackdrop } from '@/components/layout/MotifBackdrop'
import { Lightbox } from '@/components/lightbox'
import { useGalleryFilters } from '@/hooks/useGalleryFilters'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useManifest } from '@/hooks/useManifest'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { isShelfPath } from '@/utils/routes'

/** 全宽展柜壳：顶栏 + 分类 Chip + 主内容（无侧栏） */
export function AppShell() {
  const location = useLocation()
  const manifestState = useManifest()
  const items = manifestState.status === 'ready' ? manifestState.data.items : []
  const gallery = useGalleryFilters(items)
  const { navigateToCategory, clearFiltersAndNavigate } = useGalleryRouting()

  useScrollToTop()

  const onShelf = isShelfPath(location.pathname)
  const showCategoryChips =
    onShelf &&
    manifestState.status === 'ready' &&
    gallery.categories.length > 1

  return (
    <div className="relative flex min-h-full flex-col bg-bg text-fg transition-colors duration-200">
      {onShelf && <MotifBackdrop />}
      <TopBar
        filteredCount={gallery.stats.filteredGameCount}
        isFiltering={gallery.isFiltering}
        onClearFilters={clearFiltersAndNavigate}
      />
      {showCategoryChips && (
        <CategoryChips
          categories={gallery.categories}
          selectedCategory={gallery.selectedCategory}
          onSelect={navigateToCategory}
        />
      )}
      <main className="relative z-content flex-1 px-6 py-10 sm:px-10 md:px-12 md:py-12 lg:px-16">
        <Outlet context={{ manifestState, gallery }} />
      </main>
      <Lightbox />
    </div>
  )
}
