import { describe, expect, it } from 'vitest'
import { pickLocalized } from '@/utils/localized'

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
})
