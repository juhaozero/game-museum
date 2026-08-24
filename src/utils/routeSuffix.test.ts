import { describe, expect, it } from 'vitest'
import {
  getBasePathFromEnv,
  normalizeBasePath,
  withBasePath,
} from '@/utils/routeSuffix'

describe('routeSuffix', () => {
  it('normalizeBasePath 处理空值与尾斜杠', () => {
    expect(normalizeBasePath()).toBe('')
    expect(normalizeBasePath('/')).toBe('')
    expect(normalizeBasePath('/museum/')).toBe('/museum')
    expect(normalizeBasePath('museum')).toBe('/museum')
  })

  it('getBasePathFromEnv 优先 PUBLIC_ROUTE_SUFFIX', () => {
    expect(
      getBasePathFromEnv({
        PUBLIC_ROUTE_SUFFIX: '/museum',
        BASE_URL: '/other/',
      }),
    ).toBe('/museum')
  })

  it('getBasePathFromEnv 接受 BASE_URL', () => {
    expect(getBasePathFromEnv({ BASE_URL: '/museum/' })).toBe('/museum')
  })

  it('withBasePath 拼接子路径', () => {
    expect(
      withBasePath('/manifest.json'),
    ).toBe(`${getBasePathFromEnv()}/manifest.json`.replace('//', '/'))
  })
})
