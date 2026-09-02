import { describe, expect, it } from 'vitest'
import { resolveFeaturedExhibits } from './featuredShots'
import type { Manifest, ScreenshotItem } from '@/types/manifest'

const sampleItems: ScreenshotItem[] = [
  {
    id: 'a1',
    gameId: 'g1',
    gameName: 'Game A',
    category: 'RPG',
    fileName: 'cover.jpg',
    relativePath: 'game-a/cover.jpg',
    url: 'https://example.com/a/cover.jpg',
    isCover: true,
  },
  {
    id: 'a2',
    gameId: 'g1',
    gameName: 'Game A',
    category: 'RPG',
    fileName: '001.jpg',
    relativePath: 'game-a/001.jpg',
    url: 'https://example.com/a/001.jpg',
  },
]

describe('resolveFeaturedExhibits', () => {
  it('reads featured block from manifest when present', () => {
    const manifest: Manifest = {
      version: 1,
      generatedAt: '',
      cosBaseUrl: '',
      cosPathPrefix: '',
      layout: 'game-first',
      itemCount: 1,
      gameCount: 1,
      featured: {
        enabled: true,
        mode: 'manual',
        count: 1,
        labels: {
          title: { zh: '本周精选', en: 'This week' },
          hint: { zh: '点开展品', en: 'Open exhibit' },
        },
        items: [
          {
            ...sampleItems[1]!,
            caption: { zh: '精选', en: 'Featured' },
          },
        ],
      },
      items: sampleItems,
    }

    const featured = resolveFeaturedExhibits(manifest)
    expect(featured.labels?.title).toEqual({ zh: '本周精选', en: 'This week' })
    expect(featured.items[0]?.caption).toEqual({
      zh: '精选',
      en: 'Featured',
    })
  })

  it('falls back to legacy auto pick when featured is absent', () => {
    const manifest: Manifest = {
      version: 1,
      generatedAt: '',
      cosBaseUrl: '',
      cosPathPrefix: '',
      layout: 'game-first',
      itemCount: sampleItems.length,
      gameCount: 1,
      items: sampleItems,
    }

    const featured = resolveFeaturedExhibits(manifest)
    expect(featured.enabled).toBe(true)
    expect(featured.mode).toBe('auto')
    expect(featured.items.length).toBeGreaterThan(0)
  })

  it('returns empty when manifest is null', () => {
    const featured = resolveFeaturedExhibits(null)
    expect(featured.enabled).toBe(false)
    expect(featured.items).toHaveLength(0)
  })
})
