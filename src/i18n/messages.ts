export type Locale = 'zh' | 'en'

export type MessageKey = keyof typeof messages.zh

const messages = {
  zh: {
    siteTitle: 'GameShot 博物馆',
    favorites: '收藏',
    myFavorites: '我的收藏',
    searchGames: '搜索游戏',
    searchPlaceholder: '搜索游戏…',
    clear: '清除',
    gameCount: '{count} 款',
    shotCount: '{count} 张',
    shotsLabel: '{count} shots',
    menu: '菜单',
    openMenu: '打开菜单',
    themeToLight: '切换浅色',
    themeToDark: '切换深色',
    themeLight: '浅色',
    themeDark: '深色',
    langToEn: 'Switch to English',
    langToZh: '切换到中文',
    langLabel: '中文',
    langLabelEn: 'EN',
    loading: '加载中',
    backToShelf: '← 馆藏',
    categories: '游戏分类',
    allCategories: '全部',
    runManifestHint: '请先运行',
    emptyManifest:
      'manifest 为空。请整理本地截图并生成清单，详见 docs/manifest.md。',
    noMatchSearch: '没有找到与「{query}」匹配的游戏。',
    noGamesInCategory: '当前分类下没有游戏。',
    gameNotFound: '未找到该游戏。',
    noScreenshots: '暂无截图',
    noScreenshotsForGame: '该游戏暂无截图',
    favoritesEmpty: '星标过的截图会出现在这里。',
    goToShelf: '去馆藏看看',
    orphanFavorites: '有 {count} 条收藏已不在当前 manifest 中。',
    favorite: '收藏',
    unfavorite: '取消收藏',
    viewShot: '查看 {name}',
    close: '关闭',
    prevShot: '上一张',
    nextShot: '下一张',
    game: '游戏',
    category: '分类',
    file: '文件',
    lightboxHints: '← → 切换 · Esc 关闭 · 滚轮缩放',
  },
  en: {
    siteTitle: 'GameShot Museum',
    favorites: 'Favorites',
    myFavorites: 'My Favorites',
    searchGames: 'Search games',
    searchPlaceholder: 'Search games…',
    clear: 'Clear',
    gameCount: '{count} games',
    shotCount: '{count} shots',
    shotsLabel: '{count} shots',
    menu: 'Menu',
    openMenu: 'Open menu',
    themeToLight: 'Switch to light',
    themeToDark: 'Switch to dark',
    themeLight: 'Light',
    themeDark: 'Dark',
    langToEn: 'Switch to English',
    langToZh: '切换到中文',
    langLabel: '中文',
    langLabelEn: 'EN',
    loading: 'Loading',
    backToShelf: '← Collection',
    categories: 'Categories',
    allCategories: 'All',
    runManifestHint: 'Please run',
    emptyManifest:
      'Manifest is empty. Organize local screenshots and generate the list — see docs/manifest.md.',
    noMatchSearch: 'No games matching “{query}”.',
    noGamesInCategory: 'No games in this category.',
    gameNotFound: 'Game not found.',
    noScreenshots: 'No screenshots',
    noScreenshotsForGame: 'No screenshots for this game',
    favoritesEmpty: 'Starred screenshots will show up here.',
    goToShelf: 'Browse the collection',
    orphanFavorites:
      '{count} favorites are no longer in the current manifest.',
    favorite: 'Favorite',
    unfavorite: 'Remove favorite',
    viewShot: 'View {name}',
    close: 'Close',
    prevShot: 'Previous',
    nextShot: 'Next',
    game: 'Game',
    category: 'Category',
    file: 'File',
    lightboxHints: '← → navigate · Esc close · scroll to zoom',
  },
} as const satisfies Record<Locale, Record<string, string>>

export type InterpValues = Record<string, string | number>

export function translate(
  locale: Locale,
  key: MessageKey,
  values?: InterpValues,
): string {
  const template = messages[locale][key] ?? messages.zh[key]
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(values[name] ?? `{${name}}`),
  )
}

export { messages }
