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

  /**
   * 首页 filmstrip「精选展品」
   * 运行 npm run manifest 后写入 public/manifest.json 的 featured 段
   */
  featured: {
    /** 是否生成精选列表；false 则首页不显示 filmstrip */
    enabled: true,

    /**
     * auto   — 自动挑选（优先非封面、尽量覆盖不同游戏）
     * manual — 仅展示 picks 中的截图，顺序即陈列顺序
     */
    mode: 'auto',

    /** auto 模式：最多条数 */
    count: 8,

    /** auto 模式：尽量每款游戏只取一张 */
    diverseGames: true,

    /**
     * manual 模式：截图相对路径（与 layout 一致）
     * game-first:     '游戏名/文件名.jpg'
     * category-first: '分类/游戏名/文件名.jpg'
     *
     * 支持字符串或 { path, caption }；caption 可为字符串或 { zh, en }
     */
    picks: [
      // {
      //   path: 'testgame/001.jpg',
      //   caption: { zh: '开场瞬间', en: 'Opening beat' },
      // },
    ],

    /**
     * 展签文案，key 为 relativePath（auto / manual 均可用）
     * 值：字符串（双语共用）或 { zh, en }
     * 未配置时 filmstrip 铭牌显示游戏名
     */
    captions: {
      // 'testgame/resized.png': { zh: '测试展品', en: 'Test exhibit' },
    },

    /**
     * filmstrip 标题与提示：字符串或 { zh, en }
     * 未写某语言时，该语言回退前端 i18n
     */
    labels: {
      // title: { zh: '本周精选', en: 'This week' },
      // hint: { zh: '点开展品', en: 'Open exhibit' },
    },
  },
}
