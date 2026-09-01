/**
 * 解析 manifest.config.js 中的 featured 配置，生成 manifest.featured
 */

const DEFAULT_FEATURED = {
  enabled: true,
  mode: 'auto',
  count: 8,
  diverseGames: true,
  picks: [],
  captions: {},
  labels: {},
}

function normalizeRelativePath(value) {
  return String(value).replace(/\\/g, '/').replace(/^\/+/, '')
}

function normalizePickEntry(entry) {
  if (typeof entry === 'string') {
    return { path: normalizeRelativePath(entry), caption: undefined }
  }
  if (entry && typeof entry === 'object' && typeof entry.path === 'string') {
    return {
      path: normalizeRelativePath(entry.path),
      caption: typeof entry.caption === 'string' ? entry.caption.trim() : undefined,
    }
  }
  return null
}

/** @param {ReturnType<typeof normalizeFeaturedConfig>} config @param {Array<{ id: string, gameId: string, relativePath: string, isCover?: boolean }>} items */
function pickFeaturedAuto(config, items) {
  if (items.length === 0) return []

  const nonCover = items.filter((item) => !item.isCover)
  const pool = nonCover.length > 0 ? nonCover : items

  let candidates
  if (config.diverseGames) {
    const byGame = new Map()
    for (const item of pool) {
      if (!byGame.has(item.gameId)) byGame.set(item.gameId, item)
    }
    const diverse = [...byGame.values()]
    const seen = new Set(diverse.map((item) => item.id))
    const rest = pool.filter((item) => !seen.has(item.id))
    candidates = [...diverse, ...rest]
  } else {
    candidates = [...pool]
  }

  const count = Math.max(1, config.count)
  if (candidates.length >= count) return candidates.slice(0, count)

  const padded = [...candidates]
  let i = 0
  while (padded.length < count && pool.length > 0) {
    padded.push(pool[i % pool.length])
    i += 1
  }
  return padded
}

/** @param {ReturnType<typeof normalizeFeaturedConfig>} config @param {Array<{ id: string, relativePath: string }>} items */
function pickFeaturedManual(config, items, warnings) {
  const byPath = new Map(
    items.map((item) => [normalizeRelativePath(item.relativePath), item]),
  )
  const resolved = []

  for (const raw of config.picks) {
    const pick = normalizePickEntry(raw)
    if (!pick) {
      warnings.push(`[warn] featured.picks 条目无效，已跳过: ${JSON.stringify(raw)}`)
      continue
    }

    const item = byPath.get(pick.path)
    if (!item) {
      warnings.push(`[warn] featured.picks 未找到截图: ${pick.path}`)
      continue
    }

    resolved.push({ item, caption: pick.caption })
  }

  return resolved
}

function captionForItem(config, item) {
  const fromMap = config.captions?.[normalizeRelativePath(item.relativePath)]
  if (typeof fromMap === 'string' && fromMap.trim()) return fromMap.trim()
  return undefined
}

export function normalizeFeaturedConfig(raw) {
  const input = raw ?? {}
  return {
    enabled: input.enabled !== false,
    mode: input.mode === 'manual' ? 'manual' : 'auto',
    count: Number.isFinite(input.count) && input.count > 0 ? input.count : DEFAULT_FEATURED.count,
    diverseGames: input.diverseGames !== false,
    picks: Array.isArray(input.picks) ? input.picks : [],
    captions:
      input.captions && typeof input.captions === 'object' ? input.captions : {},
    labels:
      input.labels && typeof input.labels === 'object' ? input.labels : {},
  }
}

/**
 * @param {unknown} rawConfig manifest.config featured 段
 * @param {Array<Record<string, unknown>>} items 扫描得到的截图列表
 */
export function resolveFeatured(rawConfig, items) {
  const config = normalizeFeaturedConfig(rawConfig)
  const warnings = []

  if (!config.enabled) {
    return {
      featured: {
        enabled: false,
        mode: config.mode,
        count: config.count,
        labels: sanitizeLabels(config.labels),
        items: [],
      },
      warnings,
    }
  }

  let resolvedItems

  if (config.mode === 'manual') {
    if (config.picks.length === 0) {
      warnings.push('[warn] featured.mode=manual 但 picks 为空，filmstrip 将不显示')
      resolvedItems = []
    } else {
      resolvedItems = pickFeaturedManual(config, items, warnings).map(
        ({ item, caption: inlineCaption }) => ({
          ...item,
          caption: inlineCaption ?? captionForItem(config, item),
        }),
      )
    }
  } else {
    resolvedItems = pickFeaturedAuto(config, items).map((item) => ({
      ...item,
      caption: captionForItem(config, item),
    }))
  }

  return {
    featured: {
      enabled: resolvedItems.length > 0,
      mode: config.mode,
      count: config.count,
      labels: sanitizeLabels(config.labels),
      items: resolvedItems,
    },
    warnings,
  }
}

function sanitizeLabels(labels) {
  const title = typeof labels.title === 'string' ? labels.title.trim() : ''
  const hint = typeof labels.hint === 'string' ? labels.hint.trim() : ''
  const out = {}
  if (title) out.title = title
  if (hint) out.hint = hint
  return out
}
