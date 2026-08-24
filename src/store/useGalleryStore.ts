import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GalleryState = {
  /** 即时搜索词（输入框绑定） */
  searchQuery: string
  /** 当前分类筛选；null = 全部 */
  selectedCategory: string | null
  /** 收藏的截图 id 列表 */
  favoriteIds: string[]
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  clearFilters: () => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      selectedCategory: null,
      favoriteIds: [],
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      clearFilters: () => set({ searchQuery: '', selectedCategory: null }),
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((x) => x !== id)
            : [...state.favoriteIds, id],
        })),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'gameshot-gallery',
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
)
