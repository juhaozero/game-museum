import { describe, expect, it } from 'vitest'
import {
  absoluteSiteUrl,
  getSiteOrigin,
  homeSiteUrl,
  normalizeSiteOrigin,
} from './siteUrl'

describe('siteUrl', () => {
  it('normalizeSiteOrigin 去掉尾斜杠', () => {
    expect(normalizeSiteOrigin('https://ex.com/')).toBe('https://ex.com')
    expect(normalizeSiteOrigin('  https://ex.com  ')).toBe('https://ex.com')
    expect(normalizeSiteOrigin('')).toBe('')
  })

  it('getSiteOrigin 读 PUBLIC_SITE_URL', () => {
    expect(
      getSiteOrigin({ PUBLIC_SITE_URL: 'https://museum.example/' }),
    ).toBe('https://museum.example')
  })

  it('absoluteSiteUrl 拼接 origin + base + path', () => {
    const env = {
      PUBLIC_SITE_URL: 'https://ex.com',
      PUBLIC_ROUTE_SUFFIX: '/museum',
    }
    expect(absoluteSiteUrl('/', env)).toBe('https://ex.com/museum')
    expect(absoluteSiteUrl('/game/abc', env)).toBe(
      'https://ex.com/museum/game/abc',
    )
    expect(absoluteSiteUrl('/favorites', env)).toBe(
      'https://ex.com/museum/favorites',
    )
  })

  it('absoluteSiteUrl 无 origin 时返回带 base 的路径', () => {
    expect(
      absoluteSiteUrl('/game/x', { PUBLIC_ROUTE_SUFFIX: '/museum' }),
    ).toBe('/museum/game/x')
  })

  it('homeSiteUrl 等于首页绝对地址', () => {
    expect(
      homeSiteUrl({
        PUBLIC_SITE_URL: 'https://ex.com',
        PUBLIC_ROUTE_SUFFIX: '/museum',
      }),
    ).toBe('https://ex.com/museum')
  })
})
