import { describe, expect, it } from 'vitest'
import { translate } from '@/i18n/messages'

describe('translate', () => {
  it('returns zh site title by default locale', () => {
    expect(translate('zh', 'siteTitle')).toBe('游戏截图博物馆')
  })

  it('returns en site title', () => {
    expect(translate('en', 'siteTitle')).toBe('GameShot Museum')
  })

  it('interpolates values', () => {
    expect(translate('zh', 'gameCount', { count: 12 })).toBe('12 款')
    expect(translate('en', 'gameCount', { count: 12 })).toBe('12 games')
  })
})
