/**
 * 扫描本地 Screenshots/，生成 public/manifest.json
 *
 * 用法：
 *   npm run manifest
 *   node scripts/generate-manifest.js
 *   node scripts/generate-manifest.js --config ./scripts/manifest.config.local.js
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { resolveFeatured, sanitizeLocalizedText } from './resolve-featured.js'

const ROOT = path.resolve(import.meta.dirname, '..')

function parseArgs(argv) {
  const args = { config: null, dryRun: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dry-run') args.dryRun = true
    if (arg === '--config') args.config = argv[i + 1] ?? null
  }
  return args
}

async function loadConfig(configPath) {
  const candidates = [
    configPath,
    process.env.MANIFEST_CONFIG,
    path.join(ROOT, 'scripts/manifest.config.local.js'),
    path.join(ROOT, 'scripts/manifest.config.js'),
  ].filter(Boolean)

  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate)
      ? candidate
      : path.resolve(ROOT, candidate)
    if (fs.existsSync(resolved)) {
      const mod = await import(pathToFileURL(resolved).href)
      return { config: mod.default, configFile: resolved }
    }
  }

  throw new Error('未找到 manifest 配置文件')
}

function slugify(input) {
  const base = String(input)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'item'
}

function stableId(parts) {
  return crypto.createHash('sha1').update(parts.join('\0')).digest('hex').slice(0, 16)
}

function readGameMeta(gameDir) {
  const metaPath = path.join(gameDir, 'meta.json')
  if (!fs.existsSync(metaPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'))
  } catch (error) {
    console.warn(`[warn] 无法解析 ${metaPath}:`, error.message)
    return {}
  }
}

function isImageFile(name, extensions) {
  const ext = path.extname(name).toLowerCase()
  return extensions.includes(ext)
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
}

function resolveConfigPath(value, { base = ROOT } = {}) {
  if (!value || typeof value !== 'string') {
    throw new Error('配置路径不能为空')
  }
  return path.isAbsolute(value) ? path.normalize(value) : path.resolve(base, value)
}

function resolveCoverFileName(fileNames, meta, coverFileNames) {
  const lowerNames = new Map(fileNames.map((name) => [name.toLowerCase(), name]))

  // 1) meta.json: { "cover": "001.jpg" }
  if (typeof meta.cover === 'string' && meta.cover.trim()) {
    const wanted = meta.cover.trim()
    const hit = lowerNames.get(wanted.toLowerCase())
    if (hit) return hit
    console.warn(`[warn] meta.cover 未找到文件: ${wanted}`)
  }

  // 2) 配置约定文件名，如 cover.jpg
  for (const candidate of coverFileNames ?? []) {
    const hit = lowerNames.get(String(candidate).toLowerCase())
    if (hit) return hit
  }

  // 3) 文件名排序后的第一张
  const sorted = [...fileNames].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  return sorted[0] ?? null
}

/**
 * meta.captions: { "01.jpg": "文案" | { zh, en } }
 * 键按文件名（大小写不敏感）
 */
function resolveCaptionMap(metaCaptions) {
  const map = new Map()
  if (!metaCaptions || typeof metaCaptions !== 'object' || Array.isArray(metaCaptions)) {
    return map
  }
  for (const [key, value] of Object.entries(metaCaptions)) {
    const caption = sanitizeLocalizedText(value)
    if (!caption) continue
    const base = path.basename(String(key)).toLowerCase()
    if (base) map.set(base, caption)
  }
  return map
}

function resolveGameBlurb(meta) {
  return sanitizeLocalizedText(meta.blurb ?? meta.note)
}

function resolveGameYear(meta) {
  if (typeof meta.year === 'number' && Number.isFinite(meta.year)) {
    return String(meta.year)
  }
  if (typeof meta.year === 'string' && meta.year.trim()) {
    return meta.year.trim()
  }
  return undefined
}

/**
 * 解析分类：字符串或 { zh, en }
 * 规范名优先 zh → en → 回退；用于筛选 / URL / gameId
 */
function resolveCategoryFields(meta, gameName, folderCategory, config) {
  const raw =
    meta.category ??
    config.gameCategories?.[gameName] ??
    folderCategory ??
    config.defaultCategory

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const categoryTitle = sanitizeLocalizedText(raw)
    const canonical =
      (typeof raw.zh === 'string' && raw.zh.trim()) ||
      (typeof raw.en === 'string' && raw.en.trim()) ||
      config.defaultCategory
    return {
      category: String(canonical),
      ...(categoryTitle ? { categoryTitle } : {}),
    }
  }

  return { category: String(raw ?? config.defaultCategory) }
}

function collectFromGameDir({
  category,
  gameName,
  gameDir,
  relativeParts,
  config,
}) {
  const meta = readGameMeta(gameDir)
  const { category: resolvedCategory, categoryTitle } = resolveCategoryFields(
    meta,
    gameName,
    category,
    config,
  )

  const entries = listFiles(gameDir)
  const imageNames = entries
    .filter((entry) => entry.isFile() && isImageFile(entry.name, config.imageExtensions))
    .map((entry) => entry.name)

  const coverFileName = resolveCoverFileName(
    imageNames,
    meta,
    config.coverFileNames,
  )
  const gameTitle = sanitizeLocalizedText(meta.name ?? meta.title)
  const gameBlurb = resolveGameBlurb(meta)
  const gameYear = resolveGameYear(meta)
  const captionMap = resolveCaptionMap(meta.captions)

  const items = []

  for (const fileName of imageNames) {
    const relativePath = [...relativeParts, fileName].join('/')
    const objectKey = [config.cosPathPrefix, ...relativeParts, fileName]
      .filter(Boolean)
      .join('/')
    const url = `${config.cosBaseUrl.replace(/\/+$/, '')}/${objectKey.split('/').map(encodeURIComponent).join('/')}`
      .replace(/%2F/g, '/')

    const gameId = stableId(['game', resolvedCategory, gameName])
    const id = stableId(['shot', relativePath])
    const caption = captionMap.get(fileName.toLowerCase())

    items.push({
      id,
      gameId,
      gameName,
      ...(gameTitle ? { gameTitle } : {}),
      category: resolvedCategory,
      ...(categoryTitle ? { categoryTitle } : {}),
      fileName,
      relativePath,
      url,
      isCover: fileName === coverFileName,
      ...(caption ? { caption } : {}),
      ...(gameBlurb ? { gameBlurb } : {}),
      ...(gameYear ? { gameYear } : {}),
    })
  }

  return items
}

function scanSource(config) {
  const sourceRoot = resolveConfigPath(config.sourceDir)
  if (!fs.existsSync(sourceRoot)) {
    console.warn(`[warn] 源目录不存在: ${sourceRoot}`)
    return []
  }

  const items = []
  const topEntries = listFiles(sourceRoot)

  if (config.layout === 'game-first') {
    for (const entry of topEntries) {
      if (!entry.isDirectory()) continue
      if (entry.name.startsWith('.')) continue

      items.push(
        ...collectFromGameDir({
          category: config.defaultCategory,
          gameName: entry.name,
          gameDir: path.join(sourceRoot, entry.name),
          relativeParts: [entry.name],
          config,
        }),
      )
    }
    return items
  }

  // category-first
  for (const catEntry of topEntries) {
    if (!catEntry.isDirectory()) continue
    if (catEntry.name.startsWith('.')) continue

    const categoryDir = path.join(sourceRoot, catEntry.name)
    const gameEntries = listFiles(categoryDir)

    for (const gameEntry of gameEntries) {
      if (!gameEntry.isDirectory()) continue
      if (gameEntry.name.startsWith('.')) continue

      items.push(
        ...collectFromGameDir({
          category: catEntry.name,
          gameName: gameEntry.name,
          gameDir: path.join(categoryDir, gameEntry.name),
          relativeParts: [catEntry.name, gameEntry.name],
          config,
        }),
      )
    }
  }

  return items
}

function buildManifest(config, items) {
  const { featured, warnings } = resolveFeatured(config.featured, items)
  for (const message of warnings) console.warn(message)

  // 把 featured 展签写回主列表，展墙 / Lightbox 与 filmstrip 同源
  const captionById = new Map()
  for (const entry of featured?.items ?? []) {
    if (entry.caption) captionById.set(entry.id, entry.caption)
  }
  const featuredCaptions =
    config.featured?.captions && typeof config.featured.captions === 'object'
      ? config.featured.captions
      : {}

  const mergedItems = items.map((item) => {
    if (item.caption) return item
    const fromFeaturedItem = captionById.get(item.id)
    if (fromFeaturedItem) return { ...item, caption: fromFeaturedItem }
    const fromPath = sanitizeLocalizedText(
      featuredCaptions[item.relativePath] ??
        featuredCaptions[item.relativePath.replace(/\\/g, '/')],
    )
    return fromPath ? { ...item, caption: fromPath } : item
  })

  const gameIds = new Set(mergedItems.map((item) => item.gameId))
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    cosBaseUrl: config.cosBaseUrl,
    cosPathPrefix: config.cosPathPrefix,
    layout: config.layout,
    itemCount: mergedItems.length,
    gameCount: gameIds.size,
    featured,
    items: mergedItems.sort((a, b) =>
      a.relativePath.localeCompare(b.relativePath, 'zh-CN'),
    ),
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { config, configFile } = await loadConfig(args.config)

  if (config.cosBaseUrl.includes('your-bucket')) {
    console.warn('[warn] cosBaseUrl 仍为占位值，请在 manifest.config.local.js 中填写真实 COS 域名')
  }

  const items = scanSource(config)
  const manifest = buildManifest(config, items)
  const outputPath = resolveConfigPath(config.outputFile)

  if (args.dryRun) {
    console.log(JSON.stringify(manifest, null, 2))
    return
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log(`[manifest] 配置: ${path.relative(ROOT, configFile)}`)
  console.log(`[manifest] 扫描: ${resolveConfigPath(config.sourceDir)} (${config.layout})`)
  console.log(`[manifest] 游戏: ${manifest.gameCount} · 截图: ${manifest.itemCount}`)
  if (manifest.featured?.enabled) {
    console.log(
      `[manifest] 精选展品: ${manifest.featured.items.length} 条 (${manifest.featured.mode})`,
    )
  }
  console.log(`[manifest] 输出: ${outputPath}`)
}

main().catch((error) => {
  console.error('[manifest] 失败:', error.message)
  process.exit(1)
})
