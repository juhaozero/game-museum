import type {
  CategorySummary,
  GalleryFilters,
  GalleryStats,
  GameSummary,
  ScreenshotItem,
} from '@/types/manifest'
import { matchLocalizedName } from '@/utils/localized'

/** 游戏名模糊匹配（文件夹名 + 各语言标题） */
export function matchGameName(
  name: string,
  query: string | undefined,
  title?: GameSummary['title'],
): boolean {
  return matchLocalizedName(name, title, query)
}

/** 截图条目模糊匹配（游戏名 / 分类 / 展签 / 文件名） */
export function matchScreenshot(
  item: ScreenshotItem,
  query: string | undefined,
): boolean {
  const q = (query ?? '').trim().toLowerCase()
  if (!q) return true
  if (matchLocalizedName(item.gameName, item.gameTitle, query)) return true
  if (matchLocalizedName(item.category, item.categoryTitle, query)) return true
  if (matchLocalizedName('', item.caption, query)) return true
  if (matchLocalizedName('', item.gameBlurb, query)) return true
  return item.fileName.toLowerCase().includes(q)
}

/** 将 manifest 条目聚合为盒墙用的游戏摘要 */
export function aggregateGames(items: ScreenshotItem[]): GameSummary[] {
  const map = new Map<string, GameSummary>()

  for (const item of items) {
    const existing = map.get(item.gameId)
    if (!existing) {
      map.set(item.gameId, {
        id: item.gameId,
        name: item.gameName,
        title: item.gameTitle,
        category: item.category,
        categoryTitle: item.categoryTitle,
        shotCount: 1,
        // 先占位；若后续遇到 isCover 再覆盖（避免排序导致封面漂移）
        coverUrl: item.url,
        blurb: item.gameBlurb,
        year: item.gameYear,
      })
      continue
    }

    existing.shotCount += 1
    if (item.gameTitle && !existing.title) {
      existing.title = item.gameTitle
    }
    if (item.categoryTitle && !existing.categoryTitle) {
      existing.categoryTitle = item.categoryTitle
    }
    if (item.gameBlurb && !existing.blurb) {
      existing.blurb = item.gameBlurb
    }
    if (item.gameYear && !existing.year) {
      existing.year = item.gameYear
    }
    if (item.isCover) {
      existing.coverUrl = item.url
    }
  }

  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'zh-CN'),
  )
}

/** 按分类聚合游戏数量与截图数量 */
export function aggregateCategories(games: GameSummary[]): CategorySummary[] {
  const map = new Map<string, CategorySummary>()

  for (const game of games) {
    const existing = map.get(game.category)
    if (!existing) {
      map.set(game.category, {
        name: game.category,
        title: game.categoryTitle,
        gameCount: 1,
        shotCount: game.shotCount,
      })
      continue
    }

    existing.gameCount += 1
    existing.shotCount += game.shotCount
    if (game.categoryTitle && !existing.title) {
      existing.title = game.categoryTitle
    }
  }

  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'zh-CN'),
  )
}

/** 过滤游戏列表（搜索 + 分类） */
export function filterGames(
  games: GameSummary[],
  filters: GalleryFilters,
): GameSummary[] {
  const { searchQuery, category = null } = filters

  return games.filter((game) => {
    if (category && game.category !== category) return false
    return (
      matchGameName(game.name, searchQuery, game.title) ||
      matchLocalizedName(game.category, game.categoryTitle, searchQuery)
    )
  })
}

/** 过滤截图列表 */
export function filterScreenshots(
  items: ScreenshotItem[],
  filters: GalleryFilters & {
    gameId?: string
    favoriteIds?: string[]
    favoritesOnly?: boolean
  },
): ScreenshotItem[] {
  const {
    searchQuery,
    category = null,
    gameId,
    favoriteIds = [],
    favoritesOnly = false,
  } = filters

  return items.filter((item) => {
    if (gameId && item.gameId !== gameId) return false
    if (category && item.category !== category) return false
    if (favoritesOnly && !favoriteIds.includes(item.id)) return false
    return matchScreenshot(item, searchQuery)
  })
}

export function getGameById(
  games: GameSummary[],
  gameId: string | undefined,
): GameSummary | undefined {
  if (!gameId) return undefined
  return games.find((game) => game.id === gameId)
}

export function getScreenshotsByGameId(
  items: ScreenshotItem[],
  gameId: string,
): ScreenshotItem[] {
  return items
    .filter((item) => item.gameId === gameId)
    .sort((a, b) => a.fileName.localeCompare(b.fileName, 'zh-CN'))
}

export function getFavoriteScreenshots(
  items: ScreenshotItem[],
  favoriteIds: string[],
): ScreenshotItem[] {
  if (favoriteIds.length === 0) return []
  const idSet = new Set(favoriteIds)
  return items.filter((item) => idSet.has(item.id))
}

export function computeGalleryStats(
  allGames: GameSummary[],
  filteredGames: GameSummary[],
  items: ScreenshotItem[],
  favoriteIds: string[],
): GalleryStats {
  const visibleFavorites = getFavoriteScreenshots(items, favoriteIds)

  return {
    gameCount: allGames.length,
    shotCount: items.length,
    categoryCount: aggregateCategories(allGames).length,
    filteredGameCount: filteredGames.length,
    favoriteCount: favoriteIds.length,
    favoriteVisibleCount: visibleFavorites.length,
  }
}
