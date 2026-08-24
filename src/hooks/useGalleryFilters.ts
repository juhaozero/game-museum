import { useMemo } from 'react'
import type { ScreenshotItem } from '@/types/manifest'
import { useDebounce } from '@/hooks/useDebounce'
import { useGalleryStore } from '@/store/useGalleryStore'
import {
  aggregateCategories,
  aggregateGames,
  computeGalleryStats,
  filterGames,
  filterScreenshots,
  getFavoriteScreenshots,
  getGameById,
  getScreenshotsByGameId,
} from '@/utils/manifest'

/** 基于 manifest + gallery store 的派生筛选结果 */
export function useGalleryFilters(items: ScreenshotItem[]) {
  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const selectedCategory = useGalleryStore((s) => s.selectedCategory)
  const favoriteIds = useGalleryStore((s) => s.favoriteIds)

  const debouncedSearch = useDebounce(searchQuery, 300)

  const allGames = useMemo(() => aggregateGames(items), [items])
  const categories = useMemo(
    () => aggregateCategories(allGames),
    [allGames],
  )

  const filteredGames = useMemo(
    () =>
      filterGames(allGames, {
        searchQuery: debouncedSearch,
        category: selectedCategory,
      }),
    [allGames, debouncedSearch, selectedCategory],
  )

  const favoriteScreenshots = useMemo(
    () => getFavoriteScreenshots(items, favoriteIds),
    [items, favoriteIds],
  )

  const stats = useMemo(
    () => computeGalleryStats(allGames, filteredGames, items, favoriteIds),
    [allGames, filteredGames, items, favoriteIds],
  )

  const isFiltering =
    searchQuery.trim().length > 0 || selectedCategory !== null

  return {
    allGames,
    filteredGames,
    categories,
    favoriteScreenshots,
    stats,
    searchQuery,
    debouncedSearch,
    selectedCategory,
    favoriteIds,
    isFiltering,
    getGameById: (gameId: string | undefined) =>
      getGameById(allGames, gameId),
    getScreenshotsByGameId: (gameId: string) =>
      getScreenshotsByGameId(items, gameId),
    filterScreenshots: (filters: Parameters<typeof filterScreenshots>[1]) =>
      filterScreenshots(items, filters),
  }
}
