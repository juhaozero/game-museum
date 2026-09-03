/** manifest.json 单条截图 */
export type ScreenshotItem = {
  id: string
  gameId: string
  gameName: string
  /** 展示/检索用译名；缺省则沿用文件夹名 */
  gameTitle?: LocalizedText
  /** 分类规范名（筛选 / URL / gameId） */
  category: string
  /** 分类展示译名；缺省则沿用 category */
  categoryTitle?: LocalizedText
  fileName: string
  relativePath: string
  url: string
  /** 是否为该游戏盒墙封面 */
  isCover?: boolean
  /** 单图展签（meta.captions / featured） */
  caption?: LocalizedText
  /** 游戏简介（来自 meta.blurb / meta.note，写入每条便于聚合） */
  gameBlurb?: LocalizedText
  /** 年代 / 游玩年份（meta.year） */
  gameYear?: string
}

/** 精选展品（filmstrip 条目，可含展签） */
export type FeaturedExhibitItem = ScreenshotItem & {
  /** 展签；字符串或 { zh, en } — 与 ScreenshotItem.caption 同义，保留兼容 */
  caption?: LocalizedText
}

export type FeaturedExhibitMode = 'auto' | 'manual'

/** 展策文案：单语字符串，或按 locale 划分 */
export type LocalizedText = string | { zh?: string; en?: string }

export type ManifestFeatured = {
  enabled: boolean
  mode: FeaturedExhibitMode
  count: number
  /** manifest 生成时写入的可选 UI 文案（可中英分写） */
  labels?: {
    title?: LocalizedText
    hint?: LocalizedText
  }
  items: FeaturedExhibitItem[]
}

export type ManifestLayout = 'category-first' | 'game-first'

export type Manifest = {
  version: number
  generatedAt: string
  cosBaseUrl: string
  cosPathPrefix: string
  layout: ManifestLayout
  itemCount: number
  gameCount: number
  /** 首页 filmstrip 精选展品（由 manifest.config featured 生成） */
  featured?: ManifestFeatured
  items: ScreenshotItem[]
}

/** 盒墙聚合后的游戏摘要 */
export type GameSummary = {
  id: string
  /** 文件夹名（检索身份，始终可搜） */
  name: string
  /** 展示译名 */
  title?: LocalizedText
  /** 分类规范名 */
  category: string
  /** 分类展示译名 */
  categoryTitle?: LocalizedText
  shotCount: number
  coverUrl: string
  /** 柜旁简介 */
  blurb?: LocalizedText
  /** 年代 */
  year?: string
}

/** 分类统计（侧栏/筛选预留） */
export type CategorySummary = {
  /** 规范名（筛选 / URL） */
  name: string
  /** 展示译名 */
  title?: LocalizedText
  gameCount: number
  shotCount: number
}

/** 画廊过滤条件 */
export type GalleryFilters = {
  searchQuery?: string
  /** null 表示全部分类 */
  category?: string | null
}

/** 聚合统计 */
export type GalleryStats = {
  gameCount: number
  shotCount: number
  categoryCount: number
  filteredGameCount: number
  /** localStorage 中收藏 id 总数 */
  favoriteCount: number
  /** 当前 manifest 中仍能匹配到的收藏数 */
  favoriteVisibleCount: number
}
