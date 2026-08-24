import type {
  CategorySummary,
  GalleryFilters,
  GalleryStats,
  GameSummary,
  ScreenshotItem,
} from '@/types/manifest'

function normalizeQuery(query: string | undefined): string {
  return (query ?? '').trim().toLowerCase()
}

/** 游戏名模糊匹配 */
export function matchGameName(name: string, query: string | undefined): boolean {
  const q = normalizeQuery(query)
  if (!q) return true
  return name.toLowerCase().includes(q)
}

/** 截图条目模糊匹配（游戏名 + 文件名） */
export function matchScreenshot(item: ScreenshotItem, query: string | undefined): boolean {
  const q = normalizeQuery(query)
  if (!q) return true
  return (
    item.gameName.toLowerCase().includes(q) ||
    item.fileName.toLowerCase().includes(q)
  )
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
        category: item.category,
        shotCount: 1,
        coverUrl: item.url,
      })
      continue
    }

    existing.shotCount += 1
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
        gameCount: 1,
        shotCount: game.shotCount,
      })
      continue
    }

    existing.gameCount += 1
    existing.shotCount += game.shotCount
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
    return matchGameName(game.name, searchQuery)
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
