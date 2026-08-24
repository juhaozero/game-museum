/** 分类 slug 编解码（URL 安全） */
export function encodeCategorySlug(category: string): string {
  return encodeURIComponent(category)
}

export function decodeCategorySlug(slug: string): string {
  return decodeURIComponent(slug)
}

export function isShelfPath(pathname: string) {
  return pathname === '/' || pathname.startsWith('/category/')
}

/** 构建盒墙 URL，便于分享/刷新 */
export function buildShelfUrl(
  category: string | null,
  query?: string,
): string {
  const q = query?.trim()
  const search = q ? `?q=${encodeURIComponent(q)}` : ''

  if (category) {
    return `/category/${encodeCategorySlug(category)}${search}`
  }

  return search ? `/${search}` : '/'
}
