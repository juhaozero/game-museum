export type DocumentMetaInput = {
  title: string
  description: string
  /** 绝对 canonical / og:url */
  url: string
  /** 绝对图片 URL；缺省则移除 og/twitter image */
  image?: string | null
  /** og:type，默认 website */
  type?: 'website' | 'article'
  locale?: 'zh' | 'en'
  siteName?: string
}

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string | null | undefined,
) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string | null | undefined) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/** 更新 document title / description / canonical / Open Graph / Twitter */
export function applyDocumentMeta(input: DocumentMetaInput) {
  if (typeof document === 'undefined') return

  const {
    title,
    description,
    url,
    image,
    type = 'website',
    locale = 'zh',
    siteName = 'GameShot Museum',
  } = input

  document.title = title
  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'

  upsertMeta('name', 'description', description)
  upsertLink('canonical', url)

  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:site_name', siteName)
  upsertMeta('property', 'og:locale', locale === 'en' ? 'en_US' : 'zh_CN')
  upsertMeta('property', 'og:image', image ?? null)

  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', image ?? null)
}
