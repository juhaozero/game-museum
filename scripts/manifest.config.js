/**
 * Manifest 生成默认配置（可提交仓库）
 *
 * 本地覆盖：复制为 manifest.config.local.js（已被 .gitignore 忽略）
 * 或设置环境变量 MANIFEST_CONFIG 指向自定义配置文件路径。
 */
export default {
  /**
   * 本地截图根目录
   * - 相对路径：相对本项目根目录，如 'Screenshots'
   * - 绝对路径：可指向任意盘符，如 'E:/tea/yylapi/app/api/Screenshots'
   *   Windows 下也可用 'E:\\tea\\yylapi\\app\\api\\Screenshots'
   */
  sourceDir: 'Screenshots',

  /**
   * COS / OSS 公网访问根 URL（不要末尾斜杠）
   * 例：https://my-bucket.cos.ap-shanghai.myqcloud.com
   */
  cosBaseUrl: 'https://your-bucket.cos.ap-shanghai.myqcloud.com',

  /**
   * 对象存储上的路径前缀，需与实际上传目录一致
   * 最终 URL：{cosBaseUrl}/{cosPathPrefix}/{...相对路径}
   */
  cosPathPrefix: 'Screenshots',

  /** 输出 manifest 路径（相对项目根） */
  outputFile: 'public/manifest.json',

  /**
   * 目录布局
   * - category-first: Screenshots/{分类}/{游戏名}/*.{jpg,png,...}
   * - game-first:     Screenshots/{游戏名}/*.{jpg,png,...}
   */
  layout: 'game-first',

  /** game-first 模式下未指定分类时的默认值 */
  defaultCategory: '未分类',

  /** 按游戏名覆盖分类（两种布局均可用） */
  gameCategories: {
    // '塞尔达传说': 'RPG',
  },

  /** 识别的图片扩展名（小写） */
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],

  /**
   * 封面图约定文件名（不区分大小写）
   * 某游戏目录下若存在同名文件，则标记为盒墙封面。
   * 优先级：meta.json 的 cover 字段 > 本列表匹配 > 文件名排序后第一张
   */
  coverFileNames: [
    'cover.jpg',
    'cover.jpeg',
    'cover.png',
    'cover.webp',
    'cover.gif',
    'cover.avif',
  ],

  /** 是否递归扫描子目录（game-first 下一般 false） */
  recursive: false,
}
