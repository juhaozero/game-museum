import type {
  FeaturedExhibitItem,
  Manifest,
  ManifestFeatured,
  ScreenshotItem,
} from '@/types/manifest'

const EMPTY_FEATURED: ManifestFeatured = {
  enabled: false,
  mode: 'auto',
  count: 8,
  items: [],
}

/** 从 manifest 读取精选展品；旧 manifest 无 featured 段时客户端自动挑选 */
export function resolveFeaturedExhibits(
  manifest: Manifest | null | undefined,
): ManifestFeatured {
  if (!manifest || manifest.items.length === 0) return EMPTY_FEATURED

  if (manifest.featured) {
    return {
      ...manifest.featured,
      items: manifest.featured.items.filter(Boolean),
    }
  }

  const items = pickFeaturedShotsLegacy(manifest.items)
  return {
    enabled: items.length > 0,
    mode: 'auto',
    count: 8,
    items,
  }
}

/** @deprecated 仅用于无 featured 段的旧 manifest 兼容 */
export function pickFeaturedShots(
  items: ScreenshotItem[],
  count = 8,
): FeaturedExhibitItem[] {
  return pickFeaturedShotsLegacy(items, count)
}

function pickFeaturedShotsLegacy(
  items: ScreenshotItem[],
  count = 8,
): FeaturedExhibitItem[] {
  if (items.length === 0) return []

  const nonCover = items.filter((item) => !item.isCover)
  const pool = nonCover.length > 0 ? nonCover : items

  const byGame = new Map<string, ScreenshotItem>()
  for (const item of pool) {
    if (!byGame.has(item.gameId)) byGame.set(item.gameId, item)
  }

  const diverse = [...byGame.values()]
  const seen = new Set(diverse.map((item) => item.id))
  const rest = pool.filter((item) => !seen.has(item.id))
  const candidates = [...diverse, ...rest]

  if (candidates.length >= count) return candidates.slice(0, count)

  const padded: FeaturedExhibitItem[] = [...candidates]
  let i = 0
  while (padded.length < count && pool.length > 0) {
    const next = pool[i % pool.length]
    if (next) padded.push(next)
    i += 1
  }
  return padded
}
