import { describe, expect, it } from 'vitest'
import { getPublicUiEnv, parseEnvBool } from '@/utils/publicEnv'

describe('publicEnv', () => {
  it('parseEnvBool 识别常见布尔字符串', () => {
    expect(parseEnvBool(undefined, false)).toBe(false)
    expect(parseEnvBool('', true)).toBe(true)
    expect(parseEnvBool('true', false)).toBe(true)
    expect(parseEnvBool('1', false)).toBe(true)
    expect(parseEnvBool('false', true)).toBe(false)
    expect(parseEnvBool('off', true)).toBe(false)
    expect(parseEnvBool('maybe', true)).toBe(true)
  })

  it('getPublicUiEnv 读取 PUBLIC_SHOW_IMAGE_FILENAME', () => {
    expect(
      getPublicUiEnv({ PUBLIC_SHOW_IMAGE_FILENAME: 'true' }).showImageFileName,
    ).toBe(true)
    expect(getPublicUiEnv({}).showImageFileName).toBe(false)
  })

  it('getPublicUiEnv 读取 PUBLIC_SHOW_SCREENSHOT_GAME_NAME', () => {
    expect(
      getPublicUiEnv({ PUBLIC_SHOW_SCREENSHOT_GAME_NAME: 'false' })
        .showScreenshotGameName,
    ).toBe(false)
    expect(getPublicUiEnv({}).showScreenshotGameName).toBe(true)
  })

  it('getPublicUiEnv 读取 PUBLIC_ENABLE_LIGHT_MODE', () => {
    expect(
      getPublicUiEnv({ PUBLIC_ENABLE_LIGHT_MODE: 'true' }).enableLightMode,
    ).toBe(true)
    expect(getPublicUiEnv({}).enableLightMode).toBe(false)
    expect(
      getPublicUiEnv({ PUBLIC_ENABLE_LIGHT_MODE: 'off' }).enableLightMode,
    ).toBe(false)
  })
})
