/// <reference types="vite/client" />

const TRUTHY = new Set(['1', 'true', 'yes', 'on'])
const FALSY = new Set(['0', 'false', 'no', 'off'])

/** 解析 .env 中的布尔开关（true/false、1/0、yes/no、on/off） */
export function parseEnvBool(
  raw: string | undefined,
  defaultValue: boolean,
): boolean {
  if (raw === undefined || raw.trim() === '') return defaultValue
  const normalized = raw.trim().toLowerCase()
  if (TRUTHY.has(normalized)) return true
  if (FALSY.has(normalized)) return false
  return defaultValue
}

const UI_ENV_KEYS = [
  'PUBLIC_SHOW_IMAGE_FILENAME',
  'PUBLIC_SHOW_SCREENSHOT_GAME_NAME',
] as const

function defaultEnv(): Record<string, string | undefined> {
  const fromImportMeta: Record<string, string | undefined> = {}
  try {
    const metaEnv = import.meta.env as ImportMetaEnv &
      Record<string, string | undefined>
    for (const key of UI_ENV_KEYS) {
      const value = metaEnv[key]
      if (value !== undefined) fromImportMeta[key] = value
    }
  } catch {
    /* ignore */
  }
  return fromImportMeta
}

export type PublicUiEnv = {
  /** 截图网格悬停标题、Lightbox 侧栏是否显示文件名 */
  showImageFileName: boolean
  /** 收藏等多游戏列表是否在标题中显示游戏名 */
  showScreenshotGameName: boolean
}

export function getPublicUiEnv(
  env?: Record<string, string | undefined>,
): PublicUiEnv {
  const e = env ?? defaultEnv()
  return {
    showImageFileName: parseEnvBool(e.PUBLIC_SHOW_IMAGE_FILENAME, false),
    showScreenshotGameName: parseEnvBool(
      e.PUBLIC_SHOW_SCREENSHOT_GAME_NAME,
      true,
    ),
  }
}

/** 运行时 UI 开关（由 .env 的 PUBLIC_* 注入） */
export const publicUiEnv = getPublicUiEnv()
