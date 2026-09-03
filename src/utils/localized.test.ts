import { describe, expect, it } from 'vitest'
import {
  pickLocalized,
  displayGameName,
  displayCategoryName,
  matchLocalizedName,
} from '@/utils/localized'

describe('pickLocalized', () => {
  it('字符串对所有语言生效', () => {
    expect(pickLocalized('精选', 'zh')).toBe('精选')
    expect(pickLocalized('精选', 'en')).toBe('精选')
  })

  it('对象按 locale 选取，缺省返回 undefined', () => {
    const text = { zh: '精选图片', en: 'Featured shots' }
    expect(pickLocalized(text, 'zh')).toBe('精选图片')
    expect(pickLocalized(text, 'en')).toBe('Featured shots')
    expect(pickLocalized({ zh: '仅中文' }, 'en')).toBeUndefined()
    expect(pickLocalized({ en: 'EN only' }, 'zh')).toBeUndefined()
  })

  it('空串与空值视为未配置', () => {
    expect(pickLocalized('', 'zh')).toBeUndefined()
    expect(pickLocalized('  ', 'en')).toBeUndefined()
    expect(pickLocalized(undefined, 'zh')).toBeUndefined()
    expect(pickLocalized({ zh: '  ' }, 'zh')).toBeUndefined()
  })

  it('displayGameName 缺省回退文件夹名', () => {
    expect(
      displayGameName('艾尔登法环', { zh: '艾尔登法环', en: 'Elden Ring' }, 'en'),
    ).toBe('Elden Ring')
    expect(displayGameName('艾尔登法环', { en: 'Elden Ring' }, 'zh')).toBe(
      '艾尔登法环',
    )
  })

  it('displayCategoryName 与游戏名规则一致', () => {
    expect(
      displayCategoryName('动作RPG', { zh: '动作RPG', en: 'Action RPG' }, 'en'),
    ).toBe('Action RPG')
  })

  it('matchLocalizedName 中英与文件夹名均可命中', () => {
    const title = { zh: '艾尔登法环', en: 'Elden Ring' }
    expect(matchLocalizedName('艾尔登法环', title, 'elden')).toBe(true)
    expect(matchLocalizedName('艾尔登法环', title, '法环')).toBe(true)
    expect(matchLocalizedName('艾尔登法环', title, 'missing')).toBe(false)
    expect(matchLocalizedName('folder', undefined, 'fold')).toBe(true)
  })
})
