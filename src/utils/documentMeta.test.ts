import { afterEach, describe, expect, it } from 'vitest'
import { applyDocumentMeta } from './documentMeta'

describe('applyDocumentMeta', () => {
  afterEach(() => {
    document.title = ''
    document.head
      .querySelectorAll(
        'meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]',
      )
      .forEach((el) => el.remove())
  })

  it('写入 title / canonical / og / twitter', () => {
    applyDocumentMeta({
      title: '测试馆',
      description: '简介',
      url: 'https://ex.com/museum',
      image: 'https://cdn.ex.com/cover.jpg',
      locale: 'zh',
      siteName: '游戏截图收藏架',
    })

    expect(document.title).toBe('测试馆')
    expect(document.documentElement.lang).toBe('zh-CN')
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://ex.com/museum')
    expect(
      document.head
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content'),
    ).toBe('https://cdn.ex.com/cover.jpg')
    expect(
      document.head
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute('content'),
    ).toBe('summary_large_image')
  })

  it('无 image 时移除 og:image 并使用 summary', () => {
    applyDocumentMeta({
      title: 'A',
      description: 'B',
      url: 'https://ex.com',
      image: 'https://cdn.ex.com/a.jpg',
    })
    applyDocumentMeta({
      title: 'A',
      description: 'B',
      url: 'https://ex.com',
      image: null,
    })

    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull()
    expect(
      document.head
        .querySelector('meta[name="twitter:card"]')
        ?.getAttribute('content'),
    ).toBe('summary')
  })
})
