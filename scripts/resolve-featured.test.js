import { describe, expect, it } from 'vitest'
import { resolveFeatured } from './resolve-featured.js'

const sampleItems = [
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
  {
    id: 'b1',
    gameId: 'g2',
    gameName: 'Game B',
    category: 'Action',
    fileName: '001.jpg',
    relativePath: 'game-b/001.jpg',
    url: 'https://example.com/b/001.jpg',
  },
]

describe('resolveFeatured', () => {
  it('auto mode picks diverse games and skips covers when possible', () => {
    const { featured } = resolveFeatured({ mode: 'auto', count: 2 }, sampleItems)
    expect(featured.enabled).toBe(true)
    expect(featured.items).toHaveLength(2)
    expect(featured.items.map((item) => item.gameId)).toEqual(['g1', 'g2'])
    expect(featured.items.every((item) => !item.isCover)).toBe(true)
  })

  it('manual mode respects pick order and inline captions', () => {
    const { featured, warnings } = resolveFeatured(
      {
        mode: 'manual',
        picks: [
          { path: 'game-b/001.jpg', caption: 'Boss 战' },
          'game-a/cover.jpg',
        ],
      },
      sampleItems,
    )
    expect(warnings).toHaveLength(0)
    expect(featured.items.map((item) => item.relativePath)).toEqual([
      'game-b/001.jpg',
      'game-a/cover.jpg',
    ])
    expect(featured.items[0]?.caption).toBe('Boss 战')
  })

  it('warns when manual pick path is missing', () => {
    const { featured, warnings } = resolveFeatured(
      { mode: 'manual', picks: ['missing/path.jpg'] },
      sampleItems,
    )
    expect(featured.items).toHaveLength(0)
    expect(warnings.some((w) => w.includes('未找到'))).toBe(true)
  })

  it('applies captions map in auto mode', () => {
    const { featured } = resolveFeatured(
      {
        mode: 'auto',
        count: 1,
        captions: { 'game-a/001.jpg': '开场' },
      },
      sampleItems,
    )
    expect(featured.items[0]?.caption).toBe('开场')
  })
})
