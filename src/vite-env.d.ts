/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string
  readonly PUBLIC_ROUTE_SUFFIX?: string
  /** 截图网格 / Lightbox 是否显示图片文件名，默认 false */
  readonly PUBLIC_SHOW_IMAGE_FILENAME?: string
  /** 多游戏列表悬停标题是否显示游戏名，默认 true */
  readonly PUBLIC_SHOW_SCREENSHOT_GAME_NAME?: string
  /** 是否开放浅色模式切换，默认 false（深色主场） */
  readonly PUBLIC_ENABLE_LIGHT_MODE?: string
}
